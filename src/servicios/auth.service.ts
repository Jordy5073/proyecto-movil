import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Tu URL actual
  private url = 'http://192.168.18.24:8080/auth';
  
  private http = inject(HttpClient);

  // --- 1. AGREGAMOS LA "MEMORIA" DEL SERVICIO ---
  // Esto guardará el nombre del usuario para que el Perfil lo pueda leer
  private _currentUser = new BehaviorSubject<string | null>(null);
  
  // Esta es la variable que tu profile.page.ts está buscando y no encuentra
  public currentUser$ = this._currentUser.asObservable();

  constructor() { }

  register(userData: any) {
    return this.http.post(this.url + '/register', userData);
  }

  login(credentials: any) {
    // --- 2. INTERCEPTAMOS EL LOGIN PARA GUARDAR EL USUARIO ---
    return this.http.post<any>(this.url + '/login', credentials).pipe(
      tap((response) => {
        console.log('AuthService: Login exitoso', response);
        
        // AQUÍ ASUMO QUE TU BACKEND DEVUELVE UN OBJETO CON 'username'
        // Si tu backend devuelve el nombre en otro campo (ej: response.email), cámbialo aquí.
        if (response && response.username) {
          this._currentUser.next(response.username); 
        } else {
          // Si el backend no devuelve el nombre, usamos el que envió el usuario en el form
          this._currentUser.next(credentials.username);
        }

        // Opcional: Si recibes un token, podrías guardarlo en localStorage aquí
        if (response.token) localStorage.setItem('token', response.token);
      })
    );
  }

  // --- 3. IMPLEMENTAMOS EL LOGOUT QUE TE FALTA ---
  logout() {
    // Borramos al usuario de la memoria de la app
    this._currentUser.next(null);
    
    console.log('Sesión cerrada en RAM.');
    // OJO: Aquí NO borramos la huella. 
    // La huella se queda en el BiometricService para el próximo inicio rápido.
  }
}