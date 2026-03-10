import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ButtonModule, InputTextModule, FormsModule, Message, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMsg = '';

  private usuarios = [
    {
      email: 'macabrosss444@gmail.com',
      password: 'Maca@44444',
      ruta: '/app/dashboard',
      tipo: 'admin' as const,
    },
    {
      email: 'emmamar@gmail.com',
      password: 'Emma@12345',
      ruta: '/app/mi-panel',
      tipo: 'cliente' as const,
    },
  ];

  constructor(
    private router: Router,
    private permissions: PermissionsService,
  ) {}

  login() {
    const usuario = this.usuarios.find(
      (u) => u.email === this.email && u.password === this.password,
    );
    if (usuario) {
      this.errorMsg = '';
      this.permissions.setPermissions(usuario.tipo);
      this.router.navigate([usuario.ruta]);
    } else {
      this.errorMsg = 'Correo o contraseña incorrectos';
    }
  }
}
