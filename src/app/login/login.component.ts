import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EqualPasswordValidator, noWhitespace, minCharacters } from '../utils/validators';
import { IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonLabel, IonItem, IonInput, IonButton, IonList } from "@ionic/angular/standalone";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonLabel,
    IonCardContent,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonList
  ],
})
export class LoginComponent  implements OnInit {
  
  formBuilder = inject(FormBuilder);
  alertCtrl = inject(AlertController);

  loginForm = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email,
      noWhitespace,
      Validators.pattern('^[a-z0-9_]+@(gmail|hotmail)\\.(com|es)$')
    ]],
    password: ['', [
      Validators.required,
      minCharacters(8)
    ]],
    confirmPassword: ['', [Validators.required]],
  },
  { validators: [EqualPasswordValidator.validatorPassword('password','confirmPassword')] }
  );

  get email() {return this.loginForm.get('email');}
  get password() {return this.loginForm.get('password');}
  get confirmPassword() {return this.loginForm.get('confirmPassword');}


  constructor() {

   }

  ngOnInit() {}

  async onSubmit() {
   
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });

    if (this.loginForm.valid) {
      console.log('Formulario válido', this.loginForm.value);
      const alert = await this.alertCtrl.create({
        header: 'Logueado',
        message: 'Has iniciado sesión correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      console.log('Formulario inválido', this.loginForm.errors, this.loginForm.value);
    }
  }

}
