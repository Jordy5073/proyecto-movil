import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/servicios/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => { 
  
  const authService = inject(AuthService); 
  const router = inject(Router);
  const user = await firstValueFrom(authService.currentUser$);
  

  if (user) {
    return true; 
  } else {
    console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
    router.navigate(['/login']); 
    return false; 
  }
};