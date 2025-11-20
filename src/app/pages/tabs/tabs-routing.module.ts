import { Routes } from '@angular/router';

export const TABS_ROUTES: Routes = [
  // Tab Home
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  // Tab Lista
  {
    path: 'spot-list', 
    loadComponent: () => import('./spot-list/spot-list.page').then(m => m.SpotListPage)
  },
  // Tab Sugerir
  {
    path: 'suggest-spot',
    loadComponent: () => import('./suggest-spot/suggest-spot.page').then(m => m.SuggestSpotPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    // id se usa para las tarjetas 
    path: 'spot-detail/:id',
    loadComponent: () => import('./spot-detail/spot-detail.page').then(m => m.SpotDetailPage)
  },
];