import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Send, Upload} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewChecked, OnInit {
  @Input() selectedProject: string | null = null;
  @Input() chats: { sender: string; message: string }[] = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;

  newMessage: string = '';
  readonly Send = Send;
  readonly Upload = Upload;
  isStreaming: boolean = false;
  currentStreamedMessage: string = '';
  selectedFile: File | null = null;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

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

        this.chatService.uploadFile(this.selectedFile, this.newMessage).subscribe({
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

        this.chatService.sendMessageStream(messages).subscribe({
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

  private isAcceptedFileType(file: File): boolean {
    const acceptedTypes = [
      'application/pdf',
      'application/idf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    return (
      acceptedTypes.includes(file.type) ||
      (file.name.endsWith('.idf') && file.type === '')
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
