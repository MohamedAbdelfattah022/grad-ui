import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Eye,
  Building2,
  FileText,
  Activity,
} from 'lucide-angular';
import { AuthService } from '../services/auth.service';
import { SignupRequest } from '../Shared/Models';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css'],
})
export class SignUpFormComponent {
  @Output() complete = new EventEmitter<void>();
  @Output() showLogin = new EventEmitter<void>();

  signupData: SignupRequest = {
    email: '',
    password: ''
  };

  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveSession(response);
        this.complete.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
      }
    });
  }

  goToLogin() {
    this.showLogin.emit();
  }

  readonly Eye = Eye;
  readonly Building2 = Building2;
  readonly FileText = FileText;
  readonly Activity = Activity;
}
