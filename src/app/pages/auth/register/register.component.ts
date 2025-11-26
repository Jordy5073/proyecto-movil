import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonInput, IonButton, IonIcon, IonText, IonSpinner,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { AuthService } from 'src/servicios/auth.service';
import { matchPasswordsValidator } from 'src/app/utils/validadores';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonInput, IonButton, IonIcon, IonText, IonSpinner,
    IonInputPasswordToggle
  ]
})
export class RegisterPage {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  registerForm: FormGroup;
  isLoading = false;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // Validación estándar de email
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: matchPasswordsValidator() 
    });
  }

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  async onSubmit() {
    const data = this.registerForm.value;
    if(this.registerForm.valid){

      this.authService.register(data).subscribe(()=>{
        this.router.navigate(['/login']);
        console.log("registrado",data)
      },
        (error)=>{
        console.log(error);
      })
    
  }

  
}
}