import { Component } from '@angular/core';
import { SafeUrlPipe } from './safe-url.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-building-viewer',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './building-viewer.component.html',
  styleUrl: './building-viewer.component.css',
})
export class BuildingViewerComponent {
  viewerUrl = 'https://spider-idf-viewer.vercel.app/spider-idf-viewer.html';
}
