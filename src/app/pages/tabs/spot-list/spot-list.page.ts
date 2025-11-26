import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonText, IonCard } from '@ionic/angular/standalone';
import { ViewDidEnter } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { pencil, location, imageOutline, star, trash } from 'ionicons/icons';
import { PlacesService } from 'src/servicios/places.service';

@Component({
  selector: 'app-spot-list',
  templateUrl: './spot-list.page.html',
  styleUrls: ['./spot-list.page.scss'],
  standalone: true,
  imports: [IonCard, IonText, IonCardSubtitle, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule]
})
export class SpotListPage implements OnInit {
  private placesService = inject(PlacesService);
  places: any[] = [];

  constructor() {
    addIcons({location,imageOutline,star,trash,pencil});
  }
  ionViewWillEnter() {
    this.cargarLugares();
  }
  cargarLugares() {
    this.placesService.showAllPlaces().subscribe({
      next: (data: any) => {
        this.places = data;
        console.log('Lista actualizada:', this.places);
      },
      error: (err) => console.error(err)
    });
  }
  borrarLugar(id: number) {
    this.placesService.deletePlace(id).subscribe(() => {
      this.cargarLugares(); // Recargamos la lista
    });
  }



    ngOnInit() {
    }
  }


