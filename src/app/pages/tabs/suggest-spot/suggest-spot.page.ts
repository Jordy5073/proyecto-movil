import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
// Se añaden los iconos necesarios para las funcionalidades de hardware
import { star, starOutline, camera, location, trash } from 'ionicons/icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Necesario para la seguridad del Iframe

// Importación del servicio personalizado para gestión de hardware
import { DeviceService, SavedPhoto } from 'src/servicios/device.service'; // VERIFICA ESTA RUTA

import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonItem, IonNote, IonIcon, IonSelect, IonSelectOption, IonInput, IonTextarea, IonRange, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonText, IonSpinner // Se añade Spinner para feedback visual
, IonCardSubtitle } from '@ionic/angular/standalone';

import { noWhitespaceValidator, minWordsValidator, allowedEmailDomains } from 'src/app/utils/validadores';
import { PlacesService } from 'src/servicios/places.service';

@Component({
  selector: 'app-suggest-spot',
  templateUrl: './suggest-spot.page.html',
  styleUrls: ['./suggest-spot.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Componentes UI de Ionic
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel,
    IonItem, IonNote, IonIcon, IonSelect, IonSelectOption,
    IonInput, IonTextarea, IonRange, IonButton, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonGrid,
    IonCol, IonRow, IonSpinner // Feedback de carga
    ,
    IonCardSubtitle
]
})
export class SuggestSpotPage implements OnInit {

  // Inyección de dependencias
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private placeService = inject(PlacesService)
  
  // Inyección de servicios para lógica de negocio y seguridad
  private deviceService = inject(DeviceService);
  private sanitizer = inject(DomSanitizer);

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

  constructor() {
    // Registro de iconos en el Shadow DOM
    addIcons({
      star,
      starOutline,
      camera,
      location,
      trash
    });
  }

  ngOnInit() {
    console.log('Inicialización del ciclo de vida del componente');
    this.buildForm();
    this.loadSavedPhotos(); // Carga inicial de persistencia local
  }

  // Método asíncrono para recuperar fotos del sistema de archivos
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
      
      // Campos vinculados al hardware (se actualizan vía patchValue)
      // Nota: Se removió urlFormatValidator temporalmente ya que la ruta local no es HTTP
      fotoUrl: [''], 
      
      // Nuevos controles para almacenar coordenadas geográficas
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
      this.suggestForm.patchValue({
        fotoUrl: saved.webviewPath
      });

    } catch (e) {
      console.error('Excepción en captura de imagen:', e);
    } finally {
      this.loadingPhoto = false;
    }
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
    this.placeService.save(data).subscribe(()=> {
      console.log("Datos guardados",data)
    })
    
    console.log('Payload del formulario:', this.suggestForm.value);
    // Aquí iría la lógica de persistencia hacia el Backend
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