import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import {
  IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  IonLabel, IonItem, IonInput, IonButton, IonList, IonNote, IonGrid, 
  IonRow, IonCol, IonHeader, IonToolbar, IonTitle, IonInputPasswordToggle, 
  IonIcon, IonSpinner
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { fingerPrint } from 'ionicons/icons';
import { BiometricService } from 'src/servicios/biometric.service';
import { AuthService } from 'src/servicios/auth.service';
import { noWhitespaceValidator, emailStructureValidator, allowedEmailDomains } from 'src/app/utils/validadores';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonTitle, IonToolbar, IonHeader, CommonModule, ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    IonLabel, IonItem, IonInput, IonButton, IonList, IonNote, IonGrid, 
    IonRow, IonCol, IonInputPasswordToggle, IonIcon, IonSpinner
  ],
})
export class LoginComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);
  private bioService = inject(BiometricService);
  private router = inject(Router);

  loginForm!: FormGroup;
  hasBiometric = false; 
  isLoggingIn = false;

  constructor() { 
    addIcons({ fingerPrint });
  }

  ngOnInit() {
    this.buildForm();
    this.checkBiometric();
  }

  // --- AQUÍ ESTÁ EL CAMBIO DE LÓGICA ---
  async checkBiometric() {
    // 1. ¿El celular tiene hardware?
    const hardwareAvailable = await this.bioService.isAvailable();
    
    // 2. ¿El usuario ya guardó sus datos antes?
    const dataSaved = this.bioService.hasSavedCredentials();

    // SOLO mostramos el botón si AMBAS son verdaderas
    this.hasBiometric = hardwareAvailable.isAvailable && dataSaved;
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [
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
  
  // Getters para el HTML
  get username() { return this.loginForm.controls['username']; }
  get password() { return this.loginForm.controls['password']; }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoggingIn = true;
    const userData = this.loginForm.value;

    this.authService.login(userData).subscribe({
      next: async (response) => {
        console.log('Login exitoso');
        
        // Si el login manual funcionó, guardamos la huella para la PRÓXIMA vez
        const hardware = await this.bioService.isAvailable();
        if (hardware.isAvailable) {
           await this.bioService.saveCredentials(userData.username, userData.password);
           // No necesitamos actualizar hasBiometric a true aquí inmediatamente,
           // porque el usuario ya entró. La próxima vez que abra la app, saldrá el botón.
        }

        this.router.navigate(['/tabs']);
        this.isLoggingIn = false;
      },
      error: (err) => {
        console.error('Error login:', err);
        this.mostrarAlerta('Error', 'Credenciales incorrectas.');
        this.isLoggingIn = false;
      }
    });
  }

  async loginWithBiometrics() {
    const credentials = await this.bioService.getCredentials();

    if (credentials) {
      this.isLoggingIn = true;
      this.loginForm.patchValue({
        username: credentials.username,
        password: credentials.password
      });

      this.authService.login({ 
        username: credentials.username, 
        password: credentials.password 
      }).subscribe({
        next: () => {
          this.router.navigate(['/tabs']);
          this.isLoggingIn = false;
        },
        error: () => {
          this.mostrarAlerta('Error', 'Credenciales expiradas.');
          this.isLoggingIn = false;
        }
      });
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}