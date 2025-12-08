# Sistema de Manejo de Errores

Este documento describe el sistema centralizado de manejo de errores implementado en la aplicación.

## Estructura

### 1. Interfaces de Error (`models/error.interface.ts`)

#### `HttpError`
Representa un error HTTP estandarizado con toda la información relevante:
```typescript
interface HttpError {
  status: number;           // Código de estado HTTP
  statusText: string;       // Texto del estado HTTP
  message: string;          // Mensaje descriptivo del error
  url?: string;            // URL donde ocurrió el error
  error?: ApiErrorResponse; // Respuesta de error de la API
}
```

#### `ApiErrorResponse`
Estructura de la respuesta de error del backend:
```typescript
interface ApiErrorResponse {
  message?: string;                    // Mensaje principal
  error?: string;                      // Descripción del error
  errors?: Record<string, string[]>;   // Errores de validación por campo
  code?: string;                       // Código de error específico
}
```

#### `ErrorType`
Enumeración de tipos de errores de la aplicación:
- `NETWORK`: Error de conexión o red
- `UNAUTHORIZED`: No autorizado (401)
- `FORBIDDEN`: Sin permisos (403)
- `NOT_FOUND`: Recurso no encontrado (404)
- `VALIDATION`: Error de validación (400, 422)
- `SERVER`: Error del servidor (5xx)
- `UNKNOWN`: Error desconocido

#### `AppError`
Error de aplicación con clasificación semántica:
```typescript
interface AppError {
  type: ErrorType;              // Tipo clasificado del error
  message: string;              // Mensaje descriptivo
  originalError?: unknown;      // Error original
  details?: Record<string, unknown>; // Detalles adicionales
}
```

### 2. Servicio de Manejo de Errores (`services/error-handler.service.ts`)

Servicio centralizado que proporciona métodos para:

#### Conversión de Errores

```typescript
// Convertir cualquier error a HttpError tipado
toHttpError(error: unknown): HttpError

// Convertir cualquier error a AppError con clasificación semántica
toAppError(error: unknown): AppError
```

#### Mensajes de Usuario

```typescript
// Obtener mensaje amigable desde HttpError
getUserMessage(httpError: HttpError): string

// Obtener mensaje amigable desde AppError
getAppErrorMessage(appError: AppError): string
```

## Uso Recomendado

### En Servicios

Los servicios deben capturar errores, convertirlos a `HttpError` y relanzarlos:

```typescript
import type { HttpError } from '@models/error.interface';
import { ErrorHandlerService } from '@services/error-handler.service';

@Injectable({ providedIn: 'root' })
export class MiServicio {
  constructor(
    private readonly _errorHandler: ErrorHandlerService = inject(ErrorHandlerService)
  ) {}

  async miMetodo(): Promise<Respuesta> {
    try {
      return await firstValueFrom(this._http.get<Respuesta>(url));
    } catch (error: unknown) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      console.error('Error en miMetodo:', httpError.message);
      throw httpError; // Lanzar el error tipado
    }
  }
}
```

**Ventajas:**
- ✅ El tipo del error es conocido (`HttpError`)
- ✅ No hay inferencia de tipos (casting)
- ✅ Información de error estandarizada
- ✅ Fácil de testear

### En Componentes

Los componentes deben capturar el `HttpError` y obtener mensajes amigables:

```typescript
import type { HttpError } from '@models/error.interface';
import { ErrorHandlerService } from '@services/error-handler.service';

export class MiComponente {
  private readonly _errorHandler = inject(ErrorHandlerService);
  public errorMessage = '';

  async ejecutarAccion(): Promise<void> {
    try {
      await this._miServicio.miMetodo();
    } catch (error: unknown) {
      const httpError: HttpError = this._errorHandler.toHttpError(error);
      
      // Obtener mensaje amigable para el usuario
      this.errorMessage = this._errorHandler.getUserMessage(httpError);
      
      // Log con información técnica
      console.error('Error técnico:', httpError);
    }
  }
}
```

### Usando AppError para Lógica de Negocio

Cuando necesites clasificar errores por tipo:

```typescript
async manejarAccion(): Promise<void> {
  try {
    await this._servicio.metodo();
  } catch (error: unknown) {
    const appError: AppError = this._errorHandler.toAppError(error);
    
    switch (appError.type) {
      case ErrorType.UNAUTHORIZED:
        await this._router.navigate(['/login']);
        break;
      case ErrorType.FORBIDDEN:
        this.mostrarAlertaPermisos();
        break;
      case ErrorType.NETWORK:
        this.mostrarAlertaConexion();
        break;
      default:
        this.errorMessage = this._errorHandler.getAppErrorMessage(appError);
    }
  }
}
```

## Mensajes de Error Predefinidos

El servicio proporciona mensajes amigables automáticos:

| Status | Mensaje |
|--------|---------|
| 0 | No se pudo conectar con el servidor. Verifique su conexión a internet. |
| 400 | La solicitud contiene errores. Verifique los datos ingresados. |
| 401 | Credenciales inválidas. Verifique su usuario y contraseña. |
| 403 | No tiene permisos para realizar esta acción. |
| 404 | El recurso solicitado no fue encontrado. |
| 422 | Error de validación. Verifique los datos ingresados. |
| 500 | Error interno del servidor. Intente nuevamente más tarde. |
| 503 | Servicio no disponible. Intente nuevamente más tarde. |

## Beneficios

1. **Tipos Seguros**: No más `catch (error: unknown)` sin tipado
2. **Centralización**: Lógica de errores en un solo lugar
3. **Consistencia**: Todos los errores se manejan igual
4. **Mantenibilidad**: Fácil agregar nuevos tipos de error
5. **Testing**: Interfaces claras para mockear errores
6. **UX Mejorada**: Mensajes consistentes y amigables

## Ejemplo Completo

```typescript
// servicio.ts
async getData(): Promise<Data> {
  try {
    return await firstValueFrom(this._http.get<Data>(url));
  } catch (error: unknown) {
    const httpError: HttpError = this._errorHandler.toHttpError(error);
    console.error('Error obteniendo datos:', httpError.message);
    throw httpError;
  }
}

// componente.ts
async cargarDatos(): Promise<void> {
  this.loading = true;
  this.errorMessage = '';
  
  try {
    this.datos = await this._servicio.getData();
  } catch (error: unknown) {
    const httpError: HttpError = this._errorHandler.toHttpError(error);
    this.errorMessage = this._errorHandler.getUserMessage(httpError);
  } finally {
    this.loading = false;
  }
}
```
