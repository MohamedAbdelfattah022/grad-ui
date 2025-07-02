export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  email: string;
  email_confirmed_at: string | null;
  id: string;
}

export interface Session {
  access_token: string | null;
  refresh_token: string | null;
  expires_at?: number;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user_id: string;
  session?: Session;
  user?: User;
}


export interface ChatMessage {
  image_url: boolean;
  message: string;
  sender: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  messages: ChatMessage[];
  title: string;
}

export interface Message {
  role: string;
  content: string;
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  text?: string;
  content?: string;
}

export interface FileUploadResponse {
  url?: string;
  error?: string;
  content?: string;
}

