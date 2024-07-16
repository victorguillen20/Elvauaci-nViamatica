import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';


export const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"registro", component:RegistroComponent},
  {path:"inicio", loadComponent: ()=>
    import('./pages/inicio/inicio.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>  import('./pages/profile/profile.component')
      },

    ]
  }
]
