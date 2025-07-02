import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {SignupRequest, LoginRequest, AuthResponse, Session, User} from '../Shared/Models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}signup`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}login`, request);
  }

  saveSession(response: AuthResponse): void {
    // Handle both the new API response format and the old format
    if (response.access_token && response.user_id) {
      // New format: create session and user objects
      const session: Session = {
        access_token: response.access_token,
        refresh_token: null
      };

      const user: User = {
        id: response.user_id,
        email: '',  // We don't have this in the response
        email_confirmed_at: null
      };

      localStorage.setItem('session', JSON.stringify(session));
      localStorage.setItem('user', JSON.stringify(user));
    } else if (response.session && response.user) {
      // Old format
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('session', JSON.stringify(response.session));
    }
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getSession(): Session | null {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  }

  getToken(): string | null {
    const session = this.getSession();
    return session?.access_token || null;
  }


  isLoggedIn(): boolean {
    return !!this.getCurrentUser() && !!this.getSession()?.access_token;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
  }
}
