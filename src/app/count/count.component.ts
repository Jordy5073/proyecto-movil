import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonTextarea, IonSelect, IonSelectOption, IonRange, IonToggle } from "@ionic/angular/standalone";
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss'],
  imports: [IonItem, IonContent, IonLabel, 
    IonInput,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem, 
    IonLabel, 
  ]
})
export class CountComponent implements OnInit {

  loginForm!: FormGroup;

  user = new FormControl(null, [Validators.required, Validators.email]);

  password = new FormControl(null, [Validators.required, Validators.minLength(6)]);

  nombre = new FormControl(null, [Validators.required, Validators.minLength(3)]);

  edad = new FormControl(null, [Validators.required, Validators.min(18), Validators.max(100)]);

  telefono = new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);

  ciudad = new FormControl(null, [Validators.required, Validators.minLength(3)]);

  constructor() {
    this.loginForm = new FormGroup({
      Comment: new FormControl(null, [Validators.required, Validators.min(18), Validators.max(100)]),
      date: new FormControl(null, [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      place: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      hooby: new FormControl(null, [Validators.required, Validators.minLength(20)]),
      sport: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      houseNumber: new FormControl(null, [Validators.required, Validators.pattern(/^\d{5}$/)]),
    });
  }

  onSubmit() {
    console.log('Formulario enviado', this.loginForm.value);
  }

  ngOnInit() {}

}
