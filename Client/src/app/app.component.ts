// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatInterfaceComponent } from './chat-interface/chat-interface.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SignUpFormComponent,
    LoginComponent,
    CommonModule,
    SidebarComponent,
    ChatInterfaceComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  showSignUp = false;
  showLogin = true;
  isAuthenticated = false;

  private loginSuccessListener: any;
  private showSignupListener: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check if user is already logged in
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.showSignUp = false;
      this.showLogin = false;
    }

    // Listen for login success event
    this.loginSuccessListener = () => {
      this.isAuthenticated = true;
      this.showSignUp = false;
      this.showLogin = false;
    };
    window.addEventListener('login-success', this.loginSuccessListener);

    // Listen for show signup event
    this.showSignupListener = () => {
      this.showSignUp = true;
      this.showLogin = false;
    };
    window.addEventListener('show-signup', this.showSignupListener);
  }

  ngOnDestroy() {
    // Remove event listeners
    window.removeEventListener('login-success', this.loginSuccessListener);
    window.removeEventListener('show-signup', this.showSignupListener);
  }

  onSignUpComplete() {
    this.isAuthenticated = true;
    this.showSignUp = false;
    this.showLogin = false;
  }

  onShowLogin() {
    this.showSignUp = false;
    this.showLogin = true;
  }

  onProjectSelected(project: string) {
    const chatInterface = this.chatInterface;
    if (chatInterface) {
      chatInterface.onProjectSelected(project);
    }
  }
  chatInterface?: ChatInterfaceComponent;
}
