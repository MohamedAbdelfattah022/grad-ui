import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LucideAngularModule, Zap, ArrowLeft} from 'lucide-angular';
import {BuildingViewerComponent} from '../building-viewer/building-viewer.component';
import {AnalysisResultsComponent} from '../analysis-results/analysis-results.component';
import {ChatService as ProjectChatService} from './chat.service';
import {ChatComponent} from '../chat/chat.component';
import {
  mockFeatures,
  mockChats,
  mockAnalysisResults,
  Feature,
} from './mock-data';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BuildingViewerComponent,
    AnalysisResultsComponent,
    ChatComponent,
  ],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css'],
})
export class ChatInterfaceComponent {
  showUpload = false;
  showViewer = false;
  showAnalysis = false;
  showChat = false;
  selectedProject: string | null = null;

  dummyChats: {
    [key: string]: { sender: string; message: string; timestamp: string }[];
  } = {...mockChats};
  mockAnalysisResults = mockAnalysisResults;

  constructor(
    private projectChatService: ProjectChatService
  ) {
    this.projectChatService.projectSelected$.subscribe((project) => {
      this.onProjectSelected(project);
    });
  }

  features: Feature[] = mockFeatures.map((feature) => ({
    ...feature,
    action:
      feature.title === 'File Processing'
        ? () => (this.showUpload = true)
        : feature.title === '3D Visualization'
          ? () => (this.showViewer = true)
          : () => (this.showAnalysis = true),
  }));

  readonly ArrowLeft = ArrowLeft;
  readonly Zap = Zap;

  goBack() {
    this.showUpload = false;
    this.showViewer = false;
    this.showAnalysis = false;
    this.showChat = false;
    this.selectedProject = null;
  }

  onProjectSelected(project: string) {
    this.goBack();
    this.showChat = true;
    this.selectedProject = project;
    if (!this.dummyChats[project]) {
      this.dummyChats[project] = [];
    }
  }
}
