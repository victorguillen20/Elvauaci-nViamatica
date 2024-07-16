import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';


export const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"registro", component:RegistroComponent},
  {path:"inicio", loadComponent: ()=>
    import('./pages/inicio/inicio.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>  import('./pages/dashboard/dashboard.component')
      },
      {
        path: 'profile',
        loadComponent: () =>  import('./pages/profile/profile.component')
      },
      {
        path: 'mantenimiento',
        loadComponent: () =>  import('./pages/mantenimiento/mantenimiento.component')
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
