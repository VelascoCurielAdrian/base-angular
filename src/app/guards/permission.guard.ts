import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionsService } from '@services/permissions.service';

/**
 * Guard para proteger rutas basándose en permisos
 *
 * Uso en las rutas:
 * {
 *   path: 'users',
 *   canActivate: [permissionGuard],
 *   data: {
 *     permission: { module: 'users', permission: 'view' }
 *   }
 * }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state) => {
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);

  const permissionConfig = route.data['permission'] as {
    module: string;
    permission: string;
    subModule?: string;
  };

  if (!permissionConfig) {
    console.warn('⚠️ permissionGuard: No se especificó configuración de permisos');
    return true;
  }

  const hasPermission = permissionsService.can(
    permissionConfig.module,
    permissionConfig.permission,
    permissionConfig.subModule
  );

  if (!hasPermission) {
    console.warn('🚫 Acceso denegado - Permiso requerido:', permissionConfig);
    return router.createUrlTree(['/']);
  }

  return true;
};
