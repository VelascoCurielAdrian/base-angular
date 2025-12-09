import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  // Signal para el tema actual
  public readonly currentTheme = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Effect para aplicar el tema cuando cambie
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  /**
   * Obtiene el tema almacenado o el tema del sistema
   */
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (stored) return stored;

    // Si no hay tema almacenado, usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    console.log('Aplicando tema:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Verificar que se aplicó
    console.log('Atributo data-theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Clases del html:', document.documentElement.className);
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveTheme(theme: Theme): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Cambia al tema especificado
   */
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  public toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Verifica si el tema actual es oscuro
   */
  public isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
