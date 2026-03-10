import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GruposComponent } from './pages/grupos/grupos.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { MiPanelComponent } from './pages/mi-panel/mi-panel.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'mi-panel', component: MiPanelComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
