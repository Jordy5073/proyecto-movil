import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Imports de Ionic Standalone
import {
  IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon
} from '@ionic/angular/standalone';

// Importa solo el icono que necesitas
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';

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
    addIcons({
      'person-outline': personOutline
    });
  }
  goToLogin() {
    console.log('Navigating to login...');
    this.router.navigate(['/login']);
  }
}
