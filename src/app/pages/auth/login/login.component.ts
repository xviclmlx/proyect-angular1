import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../../services/permissions.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ButtonModule, InputTextModule, FormsModule, Message, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMsg = '';
  cargando = false;

  constructor(
    private router: Router,
    private permissions: PermissionsService,
    private usuarios: UsuariosService,
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    // Simular llamada a backend
    setTimeout(() => {
      const sesion = this.usuarios.autenticar(this.email, this.password);
      
      if (sesion) {
        this.permissions.setSesion(sesion);
        this.router.navigate(['/app/dashboard']);
      } else {
        this.errorMsg = 'Correo o contraseña incorrectos';
      }
      
      this.cargando = false;
    }, 300);
  }
}
