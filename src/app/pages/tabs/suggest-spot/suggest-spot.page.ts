import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline, camera, location, trash, pencil, closeCircle } from 'ionicons/icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { DeviceService, SavedPhoto } from 'src/servicios/device.service'; 
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonItem, IonNote, IonIcon, IonSelect, IonSelectOption, IonInput, IonTextarea, IonRange, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonText, IonSpinner // Se añade Spinner para feedback visual
, IonCardSubtitle, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { noWhitespaceValidator, minWordsValidator, allowedEmailDomains } from 'src/app/utils/validadores';
import { PlacesService } from 'src/servicios/places.service';

@Component({
  selector: 'app-suggest-spot',
  templateUrl: './suggest-spot.page.html',
  styleUrls: ['./suggest-spot.page.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonItemSliding,
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel,
    IonItem, IonNote, IonIcon, IonSelect, IonSelectOption,
    IonInput, IonTextarea, IonRange, IonButton, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonGrid,
    IonCol, IonRow, IonSpinner 
    ,
    IonCardSubtitle, IonText]
})
export class SuggestSpotPage implements OnInit {

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private placeService = inject(PlacesService);
  private deviceService = inject(DeviceService);
  private sanitizer = inject(DomSanitizer);
  private toastCtrl = inject(ToastController);

  suggestForm!: FormGroup;
  categorias = ['Restaurante', 'Museo', 'Parque', 'Monumento', 'Otro'];

  // Variables de estado para el manejo de recursos multimedia y geolocalización
  photos: SavedPhoto[] = [];
  lat: number | null = null;
  lng: number | null = null;
  mapUrlSafe?: SafeResourceUrl; // URL sanitizada para evitar ataques XSS en el iframe
  // Flags booleanos para control de estado asíncrono (Loading states)
  loadingPhoto = false;
  loadingLocation = false;
  places: any[] = [];         // La lista de lugares que viene del backend
  isEditing = false;          // Bandera: ¿Estoy creando o editando?
  currentPlaceId: number | null = null; // ID del lugar que estoy editando

  constructor() {
    addIcons({
      star,
      starOutline,
      camera,
      location,
      trash,
      pencil,
      closeCircle
    });
  }
  ngOnInit() {
    this.buildForm();
    this.loadSavedPhotos(); // Carga inicial de persistencia local
  }

  getAllPlaces() {
    this.placeService.showAllPlaces().subscribe({
      next: (data: any) => {
        this.places = data;
        console.log('Lugares cargados:', this.places);
      },
      error: (err) => {
        // Esto convertirá el [object Object] en texto legible
        console.error('ERROR REAL:', JSON.stringify(err)); 
        alert('ERROR: ' + JSON.stringify(err)); // Te saldrá una alerta en el celular
      }
    });
  }
  // B) PREPARAR EDICIÓN (Al dar click en el lápiz en la lista)
  onEdit(place: any) {
    this.isEditing = true;
    this.currentPlaceId = place.id;
    this.suggestForm.patchValue(place);
    // Hacemos scroll hacia arriba
    document.querySelector('ion-content')?.scrollToTop(500);
    
  }
  // C) ELIMINAR (DELETE)
  async onDelete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este lugar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          role: 'destructive',
          handler: () => {
            this.placeService.deletePlace(id).subscribe(() => {
              this.presentToast('Lugar eliminado');
              this.getAllPlaces(); // Recargar lista
              // Si borré el que estaba editando, limpio el form
              if (this.isEditing && this.currentPlaceId === id) {
                this.cancelEdit();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  // D) CANCELAR EDICIÓN
  cancelEdit() {
    this.isEditing = false;
    this.currentPlaceId = null;
    this.suggestForm.reset(); // Limpia el formulario
    // Restaurar valores por defecto si es necesario
    this.suggestForm.patchValue({ calificacion: 3 }); 
    this.lat = null;
    this.lng = null;
    this.photos = []; // Opcional: limpiar fotos locales
  }
  
  async loadSavedPhotos() {
    this.photos = await this.deviceService.loadAllPhotos();
  }

  buildForm() {
    this.suggestForm = this.formBuilder.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(5),
        noWhitespaceValidator()
      ]],
      categoria: ['', [Validators.required]],
      descripcion: ['', [
        Validators.required,
        noWhitespaceValidator(),
        minWordsValidator(8)
      ]],
      direccion: ['', [
        Validators.required,
        noWhitespaceValidator()
      ]],
      calificacion: [3, [Validators.required]],
      fotoUrl: [''], 
      latitud: [''],
      longitud: [''],
      contacto: ['', [
        Validators.required,
        Validators.email,
        allowedEmailDomains(['gmail.com', 'yahoo.com', 'hotmail.com'])
      ]]
    });
  }

  //API de Cámara mediante Servicio
  async onTakePhoto() {
    this.loadingPhoto = true;
    try {
      // Llamada asíncrona al hardware del dispositivo
      const photo = await this.deviceService.takePhoto();
      const saved = await this.deviceService.savePhoto(photo);
      
      // Actualización del estado local
      this.photos = [saved, ...this.photos];

      // Sincronización con Reactive Forms (PatchValue)
      // Esto permite que el formulario detecte el cambio sin intervención manual
      // this.suggestForm.patchValue({
      //   fotoUrl: saved.fotoBase64
      // });
      this.updateFoto(saved.fotoBase64)

    } catch (e) {
      console.error('Excepción en captura de imagen:', e);
    } finally {
      this.loadingPhoto = false;
    }

  }
  updateFoto(newfoto:string | undefined){
    this.suggestForm.patchValue({fotoUrl:newfoto})

  }

  // Integración del API de Geolocalización
  async getLocationOnce() {
    this.loadingLocation = true;
    try {
      // Obtención de coordenadas de alta precisión
      const pos = await this.deviceService.getCurrentPosition();
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;

      // Generación y sanitización de la URL del mapa
      this.updateMapUrl();

      // Inyección de coordenadas en el formulario reactivo
      this.suggestForm.patchValue({
        latitud: this.lat,
        longitud: this.lng,
        // Opcional: Autocompletar dirección si está vacía
        direccion: this.suggestForm.get('direccion')?.value || `Coordenadas GPS: ${this.lat}, ${this.lng}`
      });

    } catch (e) {
      console.error('Error en servicio de geolocalización:', e);
    } finally {
      this.loadingLocation = false;
    }
  }

  // Método auxiliar para la construcción segura del iframe (DOM Sanitization)
  updateMapUrl() {
    if (this.lat && this.lng) {
      const offset = 0.01; // Margen de renderizado (Bounding Box)
      const bbox = `${this.lng - offset}%2C${this.lat - offset}%2C${this.lng + offset}%2C${this.lat + offset}`;
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${this.lat}%2C${this.lng}`;
      
      // Bypass de seguridad para permitir la carga del recurso externo
      this.mapUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  async deletePhoto(p: SavedPhoto) {
    await this.deviceService.deletePhoto(p.fileName);
    this.photos = this.photos.filter(x => x.fileName !== p.fileName);
    
    // Limpieza del campo del formulario si se borra la foto
    if (this.photos.length === 0) {
      this.suggestForm.patchValue({ fotoUrl: '' });
    }
  }

  async onSubmit() {
    if (this.suggestForm.invalid) {
      this.suggestForm.markAllAsTouched();
      return;
    }
    const data = this.suggestForm.value
    if (this.isEditing && this.currentPlaceId !== null) {
      this.placeService.updatePlace(this.currentPlaceId, data).subscribe({
        next: () => {
          this.presentToast('Lugar actualizado correctamente');
          this.cancelEdit(); // Limpia y sale del modo edición
          this.getAllPlaces(); // Refresca la lista de abajo
          this.router.navigate(['/tabs/spot-list']);
        },
        error: (e) => console.error(e)
      });
    } else {
      this.placeService.save(data).subscribe({
        next: () => {
          this.presentToast('Lugar creado con éxito');
          this.suggestForm.reset();
          this.suggestForm.patchValue({ calificacion: 3 }); // Reset default
          this.photos = []; 
          this.getAllPlaces(); // Refresca la lista de abajo
          this.router.navigate(['/tabs/spot-list']);
        },
        error: (e) => console.error(e)
      });
  }
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Getters para encapsulamiento y acceso limpio en la vista HTML
  get nombre() { return this.suggestForm.get('nombre'); }
  get categoria() { return this.suggestForm.get('categoria'); }
  get descripcion() { return this.suggestForm.get('descripcion'); }
  get direccion() { return this.suggestForm.get('direccion'); }
  get calificacion() { return this.suggestForm.get('calificacion'); }
  get fotoUrl() { return this.suggestForm.controls['fotoUrl']; }
  get contacto() { return this.suggestForm.get('contacto'); }
}