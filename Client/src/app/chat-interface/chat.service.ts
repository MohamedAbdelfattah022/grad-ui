import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private projectSelectedSource = new Subject<string>();
  projectSelected$ = this.projectSelectedSource.asObservable();

  selectProject(project: string) {
    this.projectSelectedSource.next(project);
  }
}
