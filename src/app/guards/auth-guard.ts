import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const authGuard: CanActivateFn = () => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);

  const usuario = sessionStorage.getItem('usuario_activo');

  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
