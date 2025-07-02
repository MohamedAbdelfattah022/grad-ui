import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {Chat, Message, ChatResponse, FileUploadResponse} from '../Shared/Models';

interface ImageGenerationResponse {
  imageUrl?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private imageUrl = environment.imageUrl;

  constructor(private authService: AuthService) {
  }

  generateUniqueChatTitle(): string {
    const now = new Date();
    return `new chat`;
  }

  createNewChat(title?: string): Observable<Chat> {
    const responseSubject = new Subject<Chat>();

    const requestBody = {
      title: this.generateUniqueChatTitle()
    };

    const headers = this.getAuthHeaders();

    console.log('Creating new chat:', requestBody);

    fetch(`${this.apiUrl}chats`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: 'include'
    })
      .then(response => {
        console.log('Create chat response received:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then(data => {
        console.log('Chat created:', data);
        responseSubject.next(data);
        responseSubject.complete();
      })
      .catch(error => {
        console.error('Error in createNewChat:', error);
        responseSubject.error(`Error creating chat: ${error.message}`);
      });

    return responseSubject.asObservable();
  }

  getUserChats(): Observable<Chat[]> {
    const responseSubject = new Subject<Chat[]>();

    const headers = this.getAuthHeaders();

    console.log('Getting user chats');

    fetch(`${this.apiUrl}chats`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
      .then(response => {
        console.log('Get chats response received:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then(data => {
        console.log('User chats received:', data);
        responseSubject.next(data);
        responseSubject.complete();
      })
      .catch(error => {
        console.error('Error in getUserChats:', error);
        responseSubject.error(`Error getting chats: ${error.message}`);
      });

    return responseSubject.asObservable();
  }

  getChatById(chatId: string): Observable<Chat> {
    const responseSubject = new Subject<Chat>();

    const headers = this.getAuthHeaders();

    console.log('Getting chat by ID:', chatId);

    fetch(`${this.apiUrl}chats/${chatId}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
      .then(response => {
        console.log('Get chat response received:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then(data => {
        console.log('Chat received:', data);
        responseSubject.next(data);
        responseSubject.complete();
      })
      .catch(error => {
        console.error('Error in getChatById:', error);
        responseSubject.error(`Error getting chat: ${error.message}`);
      });

    return responseSubject.asObservable();
  }

  private getAuthHeaders(): Record<string, string> {
    const session = this.authService.getSession();
    return {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${session?.access_token || ''}`
    };
  }

  private getFileUploadHeaders(): Record<string, string> {
    const session = this.authService.getSession();
    return {
      'Accept': 'text/event-stream',
      'Authorization': `Bearer ${session?.access_token || ''}`
    };
  }

  private handleStreamingResponse<T>(
    response: Response,
    responseSubject: Subject<T>,
    parseDataFunction: (jsonData: any) => T
  ): void {
    if (!response.body) {
      throw new Error('No response body available for streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = async () => {
      try {
        while (true) {
          const {done, value} = await reader.read();

          if (done) {
            console.log('Stream completed');
            responseSubject.complete();
            break;
          }

          const chunk = decoder.decode(value, {stream: true});
          buffer += chunk;

          console.log('Raw chunk received:', chunk);

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            console.log('Processing line:', line);

            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6).trim();
              console.log('Data string:', dataStr);

              if (dataStr === '[DONE]' || dataStr === '') {
                console.log('End marker or empty data, continuing');
                continue;
              }

              try {
                const jsonData = JSON.parse(dataStr);
                console.log('Parsed JSON:', jsonData);

                const parsedResponse = parseDataFunction(jsonData);
                console.log('Parsed response:', parsedResponse);

                responseSubject.next(parsedResponse);
              } catch (parseError) {
                console.warn('Error parsing JSON from stream:', parseError);
                console.warn('Problematic data:', dataStr);

                if (dataStr.trim()) {
                  const fallbackResponse = parseDataFunction({content: dataStr});
                  responseSubject.next(fallbackResponse);
                }
              }
            } else if (line.trim() && !line.startsWith(':')) {
              console.log('Non-data line:', line);
            }
          }
        }
      } catch (streamError) {
        console.error('Error processing stream:', streamError);
        const errorMessage = streamError instanceof Error ? streamError.message : String(streamError);
        responseSubject.error(`Error processing response stream: ${errorMessage}`);
      }
    };

    processStream();
  }

  sendMessageStream(
    messages: Message[],
    prompt: string = '',
    chatId?: string | null
  ): Observable<ChatResponse> {
    const responseSubject = new Subject<ChatResponse>();
    let accumulatedContent = '';

    const requestBody = {
      message: prompt || (messages.length > 0 ? messages[messages.length - 1].content : ''),
      chat_id: chatId
    };

    const headers = this.getAuthHeaders();

    console.log('Sending message request:', requestBody);

    fetch(`${this.apiUrl}message`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: 'include'
    })
      .then(response => {
        console.log('Message response received:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.handleStreamingResponse(
          response,
          responseSubject,
          (jsonData) => {
            if (jsonData.content) {
              accumulatedContent += jsonData.content;
              return {
                text: jsonData.content,
                content: accumulatedContent
              };
            }
            return {text: jsonData.text || ''};
          }
        );
      })
      .catch(error => {
        console.error('Error in sendMessageStream:', error);
        responseSubject.error(`Error connecting to the model: ${error.message}`);
      });

    return responseSubject.asObservable();
  }

  generateImage(prompt: string, chatId?: string | null): Observable<ImageGenerationResponse> {
    const responseSubject = new Subject<ImageGenerationResponse>();

    const requestBody = {
      prompt: prompt,
      chat_id: chatId
    };

    const headers = this.getAuthHeaders();

    console.log('Generating image with prompt:', prompt, 'for chat:', chatId);

    fetch(`${this.imageUrl}generate_image`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: 'include'
    })
      .then(response => {
        console.log('Image generation response received:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('image/')) {
          return response.blob().then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            return { imageUrl };
          });
        } else {
          return response.json().then(data => {
            console.log('Image generation JSON data:', data);
            if (data.image_url) {
              return { imageUrl: data.image_url };
            } else if (data.error) {
              return { error: data.error };
            } else {
              return data;
            }
          });
        }
      })
      .then(data => {
        console.log('Image generation data received:', data);
        responseSubject.next(data);
        responseSubject.complete();
      })
      .catch(error => {
        console.error('Error in generateImage:', error);
        responseSubject.error(`Error generating image: ${error.message}`);
      });

    return responseSubject.asObservable();
  }

  uploadFile(file: File, prompt: string = '', chatId?: string | null): Observable<FileUploadResponse> {
    const responseSubject = new Subject<FileUploadResponse>();
    let accumulatedContent = '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);
    if (chatId) {
      formData.append('chat_id', chatId);
    }

    const headers = this.getFileUploadHeaders();

    console.log('Uploading file:', file.name, 'with prompt:', prompt, 'for chat:', chatId);

    fetch(`${this.apiUrl}upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
      credentials: 'include'
    })
      .then(response => {
        console.log('Upload response received:', response.status, response.statusText);
        console.log('Upload response headers:', response.headers);

        const contentType = response.headers.get('content-type');
        console.log('Upload response content-type:', contentType);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.handleStreamingResponse(
          response,
          responseSubject,
          (jsonData) => {
            console.log('Processing upload JSON data:', jsonData);

            const result: FileUploadResponse = {};

            if (jsonData.content) {
              accumulatedContent += jsonData.content;
              result.content = accumulatedContent;
            }

            if (jsonData.url) {
              result.url = jsonData.url;
            }

            if (jsonData.error) {
              result.error = jsonData.error;
            }

            if (!jsonData.content && !jsonData.url && !jsonData.error) {
              const contentStr = JSON.stringify(jsonData);
              accumulatedContent += contentStr;
              result.content = accumulatedContent;
            }

            console.log('Upload parsed result:', result);
            return result;
          }
        );
      })
      .catch(error => {
        console.error('Error in uploadFile:', error);
        responseSubject.error(`Error uploading file: ${error.message}`);
      });

    return responseSubject.asObservable();
  }
}
