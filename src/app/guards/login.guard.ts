import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

/**
 * Guard para la ruta de login
 * Redirige al home si el usuario ya está autenticado
 */
export const loginGuard: CanActivateFn = async (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar a que MSAL esté inicializado
  await authService.initializationPromise;

  const account = authService.currentAccount;

  // Si ya está autenticado, redirigir al home
  if (account) {
    return router.createUrlTree(['/']);
  }

  // Si no está autenticado, permitir acceso al login
  return true;
};
