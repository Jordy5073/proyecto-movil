import { Routes } from '@angular/router';

export const TABS_ROUTES: Routes = [
  // Ruta para el Tab Home
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  // Ruta para el Tab Lista
  {
    path: 'spot-list',
    loadComponent: () => import('./spot-list/spot-list.page').then(m => m.SpotListPage)
  },
  // Ruta para el Tab Sugerir
  {
    path: 'suggest-spot',
    loadComponent: () => import('./suggest-spot/suggest-spot.page').then(m => m.SuggestSpotPage)
  },
  // Ruta para la página de Detalle (NO es un tab, pero se carga aquí)
  {
    // Usamos un parámetro :id para saber qué lugar mostrar
    path: 'spot-detail/:id',
    loadComponent: () => import('./spot-detail/spot-detail.page').then(m => m.SpotDetailPage)
  },
  // Redirección por defecto DENTRO de tabs
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];