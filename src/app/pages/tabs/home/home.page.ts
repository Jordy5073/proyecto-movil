import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- Importante para routerLink

// Imports de Ionic Standalone
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow,
  IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonButton, IonImg, IonButtons, IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // <-- Añadido aquí
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow,
    IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonButton, IonImg, IonButtons, IonMenuButton
  ]
})
export class HomePage {

  // Array de ejemplo con ID para cada lugar
  touristSpots = [
    {
      id: 'centro-historico', 
      name: 'Centro Histórico',
      description: 'El corazón colonial de Quito, Patrimonio de la Humanidad.',
      imageUrl: 'https://vistahermosa.ec/wp-content/uploads/2019/03/centro-historico-quito-vista-hermosa.jpg'
    },
    {
      id: 'el-panecillo', 
      name: 'El Panecillo',
      description: 'Colina con vistas panorámicas y la Virgen de Quito.',
      imageUrl: 'https://cyplatam.grupoeurohispana.com/img/articulos_facebook/new-ec-1806260300-turismo-de-negocios-en-quito.jpg'
    },
    {
      id: 'mitad-del-mundo', 
      name: 'Mitad del Mundo',
      description: 'Monumento en la línea ecuatorial.',
      imageUrl: 'https://signpost-ecuador.zendesk.com/hc/article_attachments/6429969122205'
    }
  ];

  constructor() { }

  // Ya no se necesitan las funciones de navegación aquí
}