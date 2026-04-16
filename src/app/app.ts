import { Component, signal, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatIconModule],
  template: `
    <router-outlet></router-outlet>
    
    <button mat-fab class="theme-toggle-btn" (click)="toggleTheme()" color="primary">
      <mat-icon>{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styleUrl: './app.css'
})
export class App {
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  isDarkMode = signal(false);

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    this.applyTheme();
    this.saveTheme();
  }

  private applyTheme() {
    if (this.isDarkMode()) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  private saveTheme() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    }
  }

  private loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode.set(true);
        this.applyTheme();
      }
    }
  }
}
