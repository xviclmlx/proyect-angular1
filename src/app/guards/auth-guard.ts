import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const authGuard: CanActivateFn = () => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);

  if (permissions.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};