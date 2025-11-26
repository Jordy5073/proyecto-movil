import { Component, inject } from '@angular/core'; // Quitamos OnInit
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertController, ViewWillEnter } from '@ionic/angular'; // Importamos ViewWillEnter
import {
  IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, 
  IonInputPasswordToggle, IonIcon, IonSpinner, IonNote, IonLabel
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
    CommonModule, ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, 
    IonInputPasswordToggle, IonIcon, IonSpinner, IonNote, IonLabel, RouterModule
  ],
})
export class LoginComponent implements ViewWillEnter { 

  private formBuilder = inject(FormBuilder);
  private alertCtrl = inject(AlertController);
  private authService = inject(AuthService);
  private bioService = inject(BiometricService);
  private router = inject(Router);

  loginForm!: FormGroup;
  hasBiometric = false; 
  isLoggingIn = false;
  showManualLogin = true; // Nueva variable para controlar la vista limpia

  constructor() { 
    addIcons({ fingerPrint });
    this.buildForm();
  }

  // Se ejecuta CADA VEZ que la vista se vuelve activa (incluso al volver de logout)
  ionViewWillEnter() {
    this.loginForm.reset(); // Limpiamos el form anterior
    this.isLoggingIn = false;
    this.checkBiometric();
  }

  async checkBiometric() {
    console.log('--- DIAGNÓSTICO INICIO ---');
    
    // 1. Revisamos la marca en localStorage directamente
    const marcaGuardada = localStorage.getItem('bio_setup_complete');
    console.log('1. Marca en localStorage:', marcaGuardada);

    // 2. Revisamos el hardware
    const hardware = await this.bioService.isAvailable();
    console.log('2. Resultado Hardware:', hardware);

    // 3. Decisión
    const tieneDatos = marcaGuardada === 'true';
    const tieneHardware = hardware?.isAvailable;

    if (tieneHardware && tieneDatos) {
      console.log('>>> RESULTADO: MOSTRANDO BOTÓN HUELLA');
      this.hasBiometric = true;
      this.showManualLogin = false; // OCULTAMOS el formulario manual
    } else {
      console.log('>>> RESULTADO: OCULTANDO BOTÓN (Falta algo)');
      this.hasBiometric = false;
      this.showManualLogin = true;  // MOSTRAMOS el formulario manual
    }
    console.log('--- DIAGNÓSTICO FIN ---');
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
  
  get username() { return this.loginForm.controls['username']; }
  get password() { return this.loginForm.controls['password']; }

  // Método unificado para loguear
  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoggingIn = true;
    const userData = this.loginForm.getRawValue();

    this.authService.login(userData).subscribe({
      next: async (response) => {
        // YA NO IMPORTA SI response ES NULL. 
        // Si entramos aquí, es porque el servidor dijo "Código 200: Contraseña Correcta".
        console.log('Login exitoso (Backend respondió 200 OK)');
        
        // 1. Guardamos la huella
        const hardware = await this.bioService.isAvailable();
        if (hardware?.isAvailable) {
            try {
              // Esperamos a guardar antes de irnos
              await this.bioService.saveCredentials(userData.username, userData.password);
            } catch (e) {
              console.error('No se pudo actualizar la huella', e);
            }
        }

        // 2. Redirigimos
        this.router.navigate(['/tabs']);
        this.isLoggingIn = false;
      },
      error: (err) => {
        console.error('Error login:', err);
        // Solo mostramos error si el servidor responde 401 o 403 (Contraseña mal)
        this.mostrarAlerta('Error', 'Credenciales incorrectas.');
        this.isLoggingIn = false;
      }
    });
  }

  async loginWithBiometrics() {
    try {
      const credentials = await this.bioService.getCredentials();
      console.log('DATOS RECUPERADOS:', JSON.stringify(credentials));

      if (credentials && credentials.username && credentials.password) {
        // TRUCO: Rellenamos el formulario con los datos recuperados
        this.loginForm.patchValue({
          username: credentials.username,
          password: credentials.password
        });
        
        // Y llamamos a onSubmit(). Así usamos LA MISMA lógica exacta.
        this.onSubmit(); 
      } else {
        this.mostrarAlerta('Error', 'No se pudieron recuperar las credenciales.');
        this.showManualLogin = true; // Mostramos el form por si falla la huella
      }
    } catch (error) {
      this.mostrarAlerta('Error', 'Falló la autenticación biométrica');
      this.showManualLogin = true;
    }
  }

  toggleManualLogin() {
    this.showManualLogin = !this.showManualLogin;
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}