import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, 
  IonCard, IonItem, IonIcon, IonList, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/servicios/auth.service'; // <--- AJUSTA LA RUTA SI ES NECESARIO

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonLabel, IonList, IonIcon, IonItem, IonCard, IonAvatar, 
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class ProfilePage implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  // Estructura del usuario para que no de error en el HTML
  user = {
    username: 'Usuario',
    email: 'usuario@app.com',
    avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  };

  constructor() {
    // Registramos el icono de salir
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    // Nos suscribimos al AuthService para obtener el nombre real del usuario logueado
    this.authService.currentUser$.subscribe(name => {
      if (name) {
        this.user.username = name;
      }
    });
  }

  logout() {
    // 1. Limpiamos la sesión en el servicio
    this.authService.logout();

    // 2. Redirigimos al Login (asegúrate que tu ruta sea '/login')
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}