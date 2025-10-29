import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-spot-list',
  templateUrl: './spot-list.page.html',
  styleUrls: ['./spot-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule]
})
export class SpotListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
