import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.page';
import { authGuard } from 'src/servicios/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome', 
        pathMatch: 'full',
    },
    {
        path: 'welcome',
        loadComponent: () => import('../app/pages/welcome/welcome.page').then(m => m.WelcomePage)
    },
    {
        path: "formulario",
        loadComponent: () => import('../app/pages/tabs/suggest-spot/suggest-spot.page').then(m => m.SuggestSpotPage)
    },
    {
        path: 'login', 
        component: LoginComponent
    },
    {
        path: 'tabs',
        loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
        loadChildren: () => import('./pages/tabs/tabs-routing.module').then(m => m.TABS_ROUTES),

        // Ruta protegida
        canActivate: [authGuard]
    },
    {
        path: 'welcome',
        loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
    }
];