import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const permissionGuard = (permiso: string): CanActivateFn => {
  return (route: ActivatedRouteSnapshot) => {
    const permissions = inject(PermissionsService);
    const router = inject(Router);

    if (permissions.hasPermission(permiso)) {
      return true;
    }

    router.navigate(['/app/dashboard']);
    return false;
  };
};