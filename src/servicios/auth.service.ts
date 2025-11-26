import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url = 'http://192.168.18.24:8080/auth';
  
  private http = inject(HttpClient);

  // --- 1. AGREGAMOS LA "MEMORIA" DEL SERVICIO ---
  // Esto guardará el nombre del usuario para que el Perfil lo pueda leer
  private _currentUser = new BehaviorSubject<string | null>(null);
  
  // Esta es la variable que tu profile.page.ts está buscando y no encuentra
  public currentUser$ = this._currentUser.asObservable();

  constructor() { }

  register(userData:any){
    return this.http.post(this.url + '/register',userData);
  }

  login(credentials: any) {
    return this.http.post<any>(this.url + '/login', credentials).pipe(
      tap((response) => {
        console.log('AuthService: Respuesta del servidor:', response);

        // 1. CORRECCIÓN VITAL: Verificamos que 'response' exista antes de tocarlo
        if (!response) {
          console.warn('¡OJO! El login fue exitoso (200 OK) pero el servidor no devolvió datos.');
          // Asumimos que el login es válido aunque no haya token visible
          this._currentUser.next(credentials.username);
          return; // Salimos para evitar el error
        }

        // 2. Guardamos el usuario (usando el del servidor O el del formulario)
        if (response.username) {
          this._currentUser.next(response.username); 
        } else {
          this._currentUser.next(credentials.username);
        }

        // 3. Guardamos el token SOLO si existe (evitamos el crash)
        if (response.token) {
            localStorage.setItem('token', response.token);
        } else {
            console.log('No vino token en la respuesta (o el backend lo envió en los headers).');
        }
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