import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter([]),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
