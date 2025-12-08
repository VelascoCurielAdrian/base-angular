import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor para configurar las peticiones HTTP con credenciales
 * La autenticación se maneja mediante cookies HTTP-only
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonar la petición para incluir credenciales (cookies)
  const clonedRequest = req.clone({
    withCredentials: true,
  });

  return next(clonedRequest);
};
