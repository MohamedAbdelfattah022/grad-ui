import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LucideAngularModule, Eye } from 'lucide-angular';
import { LoginRequest } from '../Shared/Models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData: LoginRequest = {
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

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveSession(response);
        // Emit event to parent component
        window.dispatchEvent(new CustomEvent('login-success'));
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  goToSignup() {
    window.dispatchEvent(new CustomEvent('show-signup'));
  }

  // Icon references for template
  readonly Eye = Eye;
}
