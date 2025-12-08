import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = async (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar sesión en el backend
  const isAuthenticated = await authService.verifySession();

  if (isAuthenticated) {
    return true;
  }

  // Redirigir al login si no está autenticado
  return router.createUrlTree(['/login']);
};
