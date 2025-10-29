import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Imports de Ionic Standalone
import {
  IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon
} from '@ionic/angular/standalone';

// Importa los iconos
import { addIcons } from 'ionicons';
import { personOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon
  ]
})
export class WelcomePage {

  private router = inject(Router);

  constructor() {
    addIcons({personOutline,'shieldCheckmarkOutline':shieldCheckmarkOutline});
  }

  /**
   * Navega a la página de login correspondiente
   * @param role 'usuario' | 'admin'
   */
  goToLogin(role: 'user' | 'admin') {
    if (role === 'user') {
      console.log('Navigating to user login...');
      // Navega a la ruta /login (la que ya tienes)
      this.router.navigate(['/login']);
    } else if (role === 'admin') {
      console.log('Navigating to admin login...');
      // Aquí podrías navegar a una ruta diferente si tienes un login de admin separado
      // Por ahora, también lo mandamos a /login
      this.router.navigate(['/login']);
      // O podrías navegar a '/admin-login' si creas esa página
      // this.router.navigate(['/admin-login']);
    }
  }
}