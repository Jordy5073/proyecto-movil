import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_STORAGE_KEY = 'app_isLoggedIn';
  isLoggedIn = signal<boolean>(false);

  constructor() {
    const storedAuthState = localStorage.getItem(this.AUTH_STORAGE_KEY);
    if (storedAuthState === 'true') {
      this.isLoggedIn.set(true);
      console.log('AuthService: Sesión recuperada de localStorage');
    }
    // Sincroniza el estado del signal con localStorage
    effect(() => {
      const loggedIn = this.isLoggedIn();
      if (loggedIn) {
        localStorage.setItem(this.AUTH_STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(this.AUTH_STORAGE_KEY);
      }
      console.log('AuthService: Estado de login actualizado en localStorage:', loggedIn);
    });
  }

  login(email: string, password: string): boolean {
    if (email && password) {
      this.isLoggedIn.set(true);
      console.log('AuthService: Login exitoso');
      return true;
    } else {
      this.isLoggedIn.set(false);
      console.log('AuthService: Login fallido');
      return false;
    }
  }
  logout(): void {
  
    this.isLoggedIn.set(false);
    console.log('AuthService: Logout');
  }

  // Método para el Guardián (no cambia)
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}