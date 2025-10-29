import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.page';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome', // <-- 1. CAMBIADO: La app empieza en el login
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
        path: 'login', // <-- 2. DESCOMENTADO/ASEGURADO: Esta es tu página de login
        component: LoginComponent
    },
    {
        path: 'tabs',
        loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
        // 4. CORREGIDO: Apunta al archivo .ts y la constante correcta
        loadChildren: () => import('./pages/tabs/tabs-routing.module').then(m => m.TABS_ROUTES),

        // --- 3. AÑADIDO: GUARDIÁN PARA PROTEGER LAS PESTAÑAS ---
        canActivate: [authGuard]
    },
    {
        path: 'welcome',
        loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
    }
];