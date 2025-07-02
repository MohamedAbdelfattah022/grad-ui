import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  PlusCircle,
  Settings,
  FileText,
  HelpCircle,
  Building2,
  Activity,
} from 'lucide-angular';
import { ChatService as BackendChatService} from '../services/chat.service';
import { ChatService } from '../chat-interface/chat.service';
import { Chat } from '../Shared/Models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() projectSelected = new EventEmitter<string>();
  selectedProject: string | null = null;
  chats: Chat[] = [];
  readonly PlusCircle = PlusCircle;
  readonly FileText = FileText;
  readonly HelpCircle = HelpCircle;
  readonly Settings = Settings;
  readonly Building2 = Building2;
  readonly Activity = Activity;

  constructor(
    private chatService: ChatService,
    private BackendChatService: BackendChatService
  ) {
    this.chatService.projectSelected$.subscribe((projectId) => {
      this.selectedProject = projectId;
    });
    this.loadUserChats();
  }

  private loadUserChats() {
    this.BackendChatService.getUserChats().subscribe({
      next: (chats) => {
        this.chats = chats;
      },
      error: (err) => {
        console.error('Failed to load user chats:', err);
        this.chats = [];
      }
    });
  }

  onProjectClick(chat: Chat) {
    this.chatService.selectProject(chat.id);
    this.projectSelected.emit(chat.id);
  }

  onNewChat() {
    this.BackendChatService.createNewChat().subscribe({
      next: (newChat) => {
        this.chats = [newChat, ...this.chats];
        this.chatService.selectProject(newChat.id);
        this.projectSelected.emit(newChat.id);
      },
      error: (err) => {
        console.error('Failed to create new chat:', err);
      },
    });
  }
}
