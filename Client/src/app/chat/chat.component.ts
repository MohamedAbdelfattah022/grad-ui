import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LucideAngularModule, Send, Upload, Image} from 'lucide-angular';
import {FormsModule} from '@angular/forms';
import {ChatService} from '../services/chat.service';
import {marked} from 'marked';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Message, Chat, ChatMessage} from '../Shared/Models';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewChecked, OnInit, OnChanges {
  @Input() selectedProject: string | null = null;
  @Input() chats: { sender: string; message: string }[] = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

  newMessage: string = '';
  readonly Send = Send;
  readonly Upload = Upload;
  readonly Image = Image;
  isStreaming: boolean = false;
  currentStreamedMessage: string = '';
  selectedFile: File | null = null;
  currentChatId: string | null = null;
  userChats: Chat[] = [];
  generateImage: boolean = false;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  ngOnInit() {
    (window as any).copyCode = (button: HTMLElement) => {
      const pre = button.parentElement;
      const code = pre?.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent || '');
        button.classList.add('copied');
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          `;
        }, 2000);
      }
    };

    this.loadUserChats();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProject'] && this.selectedProject) {
      console.log('Selected project changed to:', this.selectedProject);
      this.selectChat(this.selectedProject);
    }
  }

  loadUserChats() {
    this.chatService.getUserChats().subscribe({
      next: (chats) => {
        this.userChats = chats;
        console.log('User chats loaded:', this.userChats);

        if (this.userChats.length > 0 && !this.currentChatId) {
          this.selectChat(this.userChats[0].id);
        }
      },
      error: (error) => {
        console.error('Error loading user chats:', error);
      }
    });
  }

  createNewChat() {
    this.chatService.createNewChat().subscribe({
      next: (chat) => {
        console.log('New chat created:', chat);
        this.userChats.unshift(chat);
        this.selectChat(chat.id);
      },
      error: (error) => {
        console.error('Error creating new chat:', error);
      }
    });
  }

  selectChat(chatId: string) {
    this.currentChatId = chatId;
    this.chatService.getChatById(chatId).subscribe({
      next: (chat) => {
        console.log('Chat loaded:', chat);
        this.chats = chat.messages.map(msg => {
          if (msg.sender === 'AI') {
            if (msg.message.includes('image_url') || msg.image_url) {
              try {
                const data = msg.message ? JSON.parse(msg.message) : {};
                const imageUrl = data.image_url || msg.image_url;
                if (imageUrl) {
                  return {
                    sender: msg.sender,
                    message: `<img src="${imageUrl}" alt="Generated image" class="max-w-full rounded-lg">`
                  };
                }
              } catch (e) {
                if (msg.image_url) {
                  return {
                    sender: msg.sender,
                    message: `<img src="${msg.image_url}" alt="Generated image" class="max-w-full rounded-lg">`
                  };
                }
                console.log('Message is not JSON or does not contain image_url:', msg.message);
              }
            }
          }

          return {
            sender: msg.sender,
            message: msg.message
          };
        });
        setTimeout(() => this.scrollToBottom(), 10);
      },
      error: (error) => {
        console.error('Error loading chat:', error);
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && !this.isStreaming) {
      if (this.selectedFile) {
        this.chats.push({
          sender: 'User',
          message: `File: ${this.selectedFile.name}\n${this.newMessage}`,
        });

        this.chats.push({
          sender: 'AI',
          message: '',
        });

        this.isStreaming = true;
        this.currentStreamedMessage = '';

        if (!this.currentChatId) {
          this.createNewChat();
        }

        this.chatService.uploadFile(this.selectedFile, this.newMessage, this.currentChatId).subscribe({
          next: (response) => {
            if (response.content) {
              this.currentStreamedMessage = response.content;
              this.chats[this.chats.length - 1].message = this.currentStreamedMessage;
            } else if (response.url) {
              this.currentStreamedMessage += `File processed successfully: ${response.url}\n`;
              this.chats[this.chats.length - 1].message = this.currentStreamedMessage;
            } else if (response.error) {
              this.currentStreamedMessage += `Error: ${response.error}\n`;
              this.chats[this.chats.length - 1].message = this.currentStreamedMessage;
            }
            setTimeout(() => this.scrollToBottom(), 10);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.chats[this.chats.length - 1].message =
              `Error uploading file: ${error}`;
            this.isStreaming = false;
          },
          complete: () => {
            this.isStreaming = false;
            this.currentStreamedMessage = '';
            this.selectedFile = null;
            setTimeout(() => this.scrollToBottom(), 100);
          },
        });
      } else if (this.generateImage) {
        this.chats.push({
          sender: 'User',
          message: this.newMessage,
        });

        this.chats.push({
          sender: 'AI',
          message: 'Generating image...',
        });

        this.isStreaming = true;

        if (!this.currentChatId) {
          this.createNewChat();
        }

        this.chatService.generateImage(this.newMessage, this.currentChatId).subscribe({
          next: (response) => {
            if (response.imageUrl) {
              const imageHtml = `<img src="${response.imageUrl}" alt="Generated image" class="max-w-full rounded-lg">`;
              this.chats[this.chats.length - 1].message = imageHtml;
            } else if (response.error) {
              this.chats[this.chats.length - 1].message = `Error generating image: ${response.error}`;
            }
            setTimeout(() => this.scrollToBottom(), 10);
          },
          error: (error) => {
            console.error('Error generating image:', error);
            this.chats[this.chats.length - 1].message = `Error generating image: ${error}`;
            this.isStreaming = false;
          },
          complete: () => {
            this.isStreaming = false;
            this.generateImage = false;
            setTimeout(() => this.scrollToBottom(), 100);
          },
        });
      } else {
        this.chats.push({
          sender: 'User',
          message: this.newMessage,
        });

        const messages: Message[] = this.chats.map((chat) => ({
          role: chat.sender.toLowerCase() === 'user' ? 'user' : 'assistant',
          content: chat.message,
        }));

        this.chats.push({
          sender: 'AI',
          message: '',
        });

        this.isStreaming = true;
        this.currentStreamedMessage = '';

        if (!this.currentChatId) {
          this.createNewChat();
        }

        this.chatService.sendMessageStream(messages, this.newMessage, this.currentChatId).subscribe({
          next: (response) => {
            if (response.content) {
              this.currentStreamedMessage = response.content;
              this.chats[this.chats.length - 1].message = this.currentStreamedMessage;
            } else if (response.text) {
              this.currentStreamedMessage += response.text;
              this.chats[this.chats.length - 1].message = this.currentStreamedMessage;
            }
            setTimeout(() => this.scrollToBottom(), 10);
          },
          error: (error) => {
            console.error('Error from chat service:', error);
            this.chats[this.chats.length - 1].message =
              'Error: Could not get response from LLM. Please try again.';
            this.isStreaming = false;
          },
          complete: () => {
            this.isStreaming = false;
            this.currentStreamedMessage = '';
            setTimeout(() => this.scrollToBottom(), 100);
          },
        });
      }

      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files).filter((file) =>
        this.isAcceptedFileType(file)
      );

      if (files.length > 0) {
        this.selectedFile = files[0];
        input.value = '';
      }
    }
  }

  clearSelectedFile() {
    this.selectedFile = null;
  }

  toggleImageGeneration() {
    this.generateImage = !this.generateImage;
  }

  private isAcceptedFileType(file: File): boolean {
    const acceptedTypes = [
      'application/pdf',
      'application/idf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'text/csv',
      'application/vnd.ms-excel',
    ];
    return (
      acceptedTypes.includes(file.type) ||
      (file.name.endsWith('.idf') && file.type === '') ||
      (file.name.endsWith('.csv') && file.type === '')
    );
  }

  renderMarkdown(content: string): SafeHtml {
    const renderer = new marked.Renderer();
    renderer.code = (code: { text: string; lang?: string }): string => {
      const copyButton = `
        <button class="copy-button" onclick="copyCode(this)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
      `;
      const languageClass = code.lang ? `language-${code.lang}` : '';
      return `<pre><code class="${languageClass}">${code.text}</code>${copyButton}</pre>`;
    };

    marked.setOptions({
      gfm: true,
      breaks: true,
      renderer
    });

    const htmlContent = marked.parse(content) as string;
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
