import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import {
  IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  IonLabel, IonItem, IonInput, IonButton, IonList, IonNote, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonTitle, IonInputPasswordToggle
} from "@ionic/angular/standalone";
import { noWhitespaceValidator, emailStructureValidator, allowedEmailDomains } from 'src/app/utils/validadores';
import { AuthService } from 'src/servicios/auth.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader,
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    IonLabel, IonItem, IonInput, IonButton, IonList, IonNote, IonGrid, IonRow, IonCol, IonInputPasswordToggle
  ],
})
export class LoginComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);
  private router = inject(Router);


  loginForm!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        emailStructureValidator(),
        allowedEmailDomains(['gmail.com', 'yahoo.com', 'hotmail.com'])


      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        noWhitespaceValidator()
      ]],
    });
  }


  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }


  async onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      // 2. Llamamos al servicio (asumiendo que tu AuthService tiene un método 'login')
      await this.authService.login(email, password);

      // 3. Éxito: Reseteamos el formulario y navegamos
      this.loginForm.reset();
      this.router.navigate(['/tabs']);

    } catch (error) {
      // 4. Error: Mostramos la alerta de Ionic
      console.error('Error en login:', error);
      this.mostrarAlerta('Error al Iniciar Sesión', 'El correo o la contraseña son incorrectos.');
    }
  }
    async mostrarAlerta(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
