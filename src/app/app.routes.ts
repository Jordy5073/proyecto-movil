import { Routes } from '@angular/router';
import { CountComponent } from './count/count.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'count',
    component: CountComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
