import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonRouterOutlet, IonTabs,  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, addCircleOutline, listOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [ IonTabBar, IonLabel, IonIcon, CommonModule, IonTabButton, IonRouterOutlet, IonTabs]
})
export class TabsPage implements OnInit {

  constructor() { 
    addIcons({
      'home-outline': homeOutline,
      'add-circle-outline': addCircleOutline,
      'list-outline': listOutline,
      'person': personCircleOutline
    });
  }

  ngOnInit() {
  }

}
