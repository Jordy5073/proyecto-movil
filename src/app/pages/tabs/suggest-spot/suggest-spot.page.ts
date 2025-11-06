import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { LugaresService, Lugar } from 'src/servicios/lugares.service';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel,
  IonItem,
  IonNote,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonRange,
  IonButton, IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonCol,
  IonRow, IonText
} from '@ionic/angular/standalone';

import { noWhitespaceValidator, urlFormatValidator, minWordsValidator, allowedEmailDomains } from 'src/app/utils/validadores';

@Component({
  selector: 'app-suggest-spot',
  templateUrl: './suggest-spot.page.html',
  styleUrls: ['./suggest-spot.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel,
    IonItem, IonNote, IonIcon, IonSelect, IonSelectOption,
    IonInput, IonTextarea, IonRange, IonButton, IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    IonRow,
    ReactiveFormsModule

  ]
})
export class SuggestSpotPage implements OnInit {

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  suggestForm!: FormGroup;

  categorias = ['Restaurante', 'Museo', 'Parque', 'Monumento', 'Otro'];

  // Tu constructor ya está perfecto
  constructor(private lugaresService: LugaresService) {
    addIcons({
      star,
      starOutline,
    });
  }

  // Tu ngOnInit ya está perfecto
  ngOnInit() {
    console.log('SuggestSpotPage: ngOnInit iniciado');
    this.buildForm();
  }

  // Tu buildForm ya está perfecto
  buildForm() {
    this.suggestForm = this.formBuilder.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(5),
        noWhitespaceValidator()
      ]],
      categoria: ['', [
        Validators.required
      ]],
      descripcion: ['', [
        Validators.required,
        noWhitespaceValidator(),
        minWordsValidator(8)
      ]],
      direccion: ['', [
        Validators.required,
        noWhitespaceValidator()
      ]],
      calificacion: [3, [Validators.required
      ]],
      fotoUrl: ['', [
        urlFormatValidator()
      ]],
      contacto: ['', [
        Validators.required,
        Validators.email,
        allowedEmailDomains(['gmail.com', 'yahoo.com', 'hotmail.com'])
      ]]
    });
  }
  async onSubmit() {
    if (this.suggestForm.invalid) {
      this.suggestForm.markAllAsTouched();
      return;
    }

    // 2. Obtenemos los datos del formulario
    // (Asegurándonos de que coincida con la interfaz 'Lugar')
    const datosDelFormulario = this.suggestForm.value as Lugar;

    console.log('Enviando al backend:', datosDelFormulario);

    //conexión
    this.lugaresService.crearLugar(datosDelFormulario)
      .subscribe({
        
        
        next: async (lugarGuardado) => {
          console.log('Respuesta del backend:', lugarGuardado);
          
          
          const alert = await this.alertCtrl.create({
            header: '¡Sugerencia Enviada!',
            message: `Gracias por tu contribución. "${lugarGuardado.nombre}" se ha guardado.`,
            buttons: ['Aceptar']
          });
          await alert.present();

          this.suggestForm.reset({ calificacion: 3 });
          this.router.navigate(['/tabs/home']);
        },

        
        error: async (err) => {
          console.error('Error al contactar el backend:', err);
          const alert = await this.alertCtrl.create({
            header: 'Error al Enviar',
            message: 'No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.',
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      });
  }
  get nombre() { return this.suggestForm.get('nombre'); }
  get categoria() { return this.suggestForm.get('categoria'); }
  get descripcion() { return this.suggestForm.get('descripcion'); }
  get direccion() { return this.suggestForm.get('direccion'); }
  get calificacion() { return this.suggestForm.get('calificacion'); }
  get fotoUrl() { return this.suggestForm.controls['fotoUrl']; }
  get contacto() { return this.suggestForm.get('contacto'); }
}