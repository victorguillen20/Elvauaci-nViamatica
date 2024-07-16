import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { BodyComponent } from './pages/body/body.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';
import { SidenavComponent } from './pages/sidenav/sidenav.component';

export const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"registro", component:RegistroComponent},
  {path:"inicio", component:InicioComponent},
  {path:"body", component:BodyComponent},
  {path:"dashboard", component:DashboardComponent},
  {path:"mantenimiento", component:MantenimientoComponent},
  {path:"sidenav", component:SidenavComponent}
];
