import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import {
  IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  IonLabel, IonItem, IonInput, IonButton, IonList, IonNote, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonTitle, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { noWhitespaceValidator, emailStructureValidator, allowedEmailDomains } from 'src/app/utils/validadores'; 
import { AuthService } from 'src/app/core/auth.service'; 

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

  constructor() {}

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

   
    const loggedIn = this.authService.login(this.email.value, this.password.value);

    if (loggedIn) {
      console.log('LoginComponent: Login successful, navigating to /tabs');
      
      this.router.navigate(['/tabs']);
    } else {
      
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Correo electrónico o contraseña incorrectos.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}