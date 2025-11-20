import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => { 

  const token = localStorage.getItem("token")

  
  const router = inject(Router);

  
  

  if (token) {
    return true; 
  } else {
    console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
    router.navigate(['/login']); 
    return false; 
  }
};