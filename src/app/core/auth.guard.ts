import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service'; // Asegúrate que la ruta sea correcta

// Esta es la forma moderna de crear Guardianes (como función)
export const authGuard: CanActivateFn = (route, state) => {
  
  // Inyectamos las dependencias necesarias
  const authService = inject(AuthService); 
  const router = inject(Router);

  // Comprobamos si el usuario está autenticado
  if (authService.isAuthenticated()) {
    return true; // Sí está logueado, permite pasar a la ruta
  } else {
    // No está logueado, redirige a la página de login
    console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
    router.navigate(['/login']); 
    return false; // Bloquea el acceso a la ruta solicitada
  }
};