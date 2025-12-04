# Breadcrumbs - Guía de Implementación

## Descripción

Los breadcrumbs (migas de pan) han sido implementados para proporcionar una navegación jerárquica clara en la aplicación. Se actualizan automáticamente basándose en la ruta actual.

## Archivos Creados

### 1. Modelo de Breadcrumb
**Ubicación:** `src/app/models/breadcrumb.interface.ts`

Define la estructura de un breadcrumb con las siguientes propiedades:
- `label`: Etiqueta visible del breadcrumb
- `url`: URL asociada (opcional, si no existe el breadcrumb no será clickeable)
- `isActive`: Indica si es el breadcrumb actual

### 2. Servicio de Breadcrumbs
**Ubicación:** `src/app/services/breadcrumb.service.ts`

Servicio que:
- Escucha los eventos de navegación del router
- Construye automáticamente los breadcrumbs basándose en la ruta actual
- Busca información de navegación en `NAVIGATION_ITEMS`
- Proporciona un signal reactivo con los breadcrumbs actuales
- Formatea automáticamente segmentos de URL cuando no hay configuración explícita

### 3. Componente de Breadcrumbs
**Ubicación:** `src/app/shared/breadcrumb/breadcrumb.component.ts`

Componente visual standalone que:
- Muestra los breadcrumbs con separadores
- Hace los breadcrumbs intermedios clickeables
- El último breadcrumb (activo) no es clickeable
- Utiliza iconos de Lucide Angular para los separadores
- Es totalmente responsive

**Estilos:** `src/app/shared/breadcrumb/breadcrumb.component.scss`
- Diseño responsive
- Estados hover y focus para accesibilidad
- Variables CSS personalizables
- Adaptación para móviles

## Integración

### En Main Layout
El componente de breadcrumbs ha sido integrado en `MainLayoutComponent`:

```typescript
<main class="layout__content">
  <app-breadcrumb />
  <router-outlet />
</main>
```

### Configuración de Rutas
Las rutas privadas han sido actualizadas para incluir metadata de breadcrumbs:

```typescript
{
  path: PRIVATE_ROUTES.CIA,
  data: { breadcrumb: 'Cia' },
  children: [
    {
      path: 'propuestas',
      loadComponent: () => import('@modules/cia-propuestas/cia-propuestas').then((m) => m.CiaPropuestas),
      data: { breadcrumb: 'Propuestas' },
    },
    // ...
  ],
}
```

## Uso

### Automático
Los breadcrumbs se generan automáticamente para todas las rutas. El servicio:

1. Busca coincidencias en `NAVIGATION_ITEMS`
2. Si no encuentra, usa la metadata `data.breadcrumb` de las rutas
3. Como último recurso, formatea el segmento de URL

### Ejemplos de Navegación

| Ruta | Breadcrumbs |
|------|-------------|
| `/` | Inicio |
| `/settings` | Inicio > Configuración |
| `/cia/propuestas` | Inicio > Cia > Propuestas |
| `/cia/reportes` | Inicio > Cia > Reportes |

## Personalización

### Estilos
Puedes personalizar los breadcrumbs modificando las variables CSS en `breadcrumb.component.scss`:

```scss
.breadcrumb {
  &__link {
    color: var(--text-secondary);
    &:hover {
      color: var(--primary-color);
    }
  }
}
```

### Agregar Nuevas Rutas
Para agregar breadcrumbs a nuevas rutas:

1. **Opción 1:** Agregar a `NAVIGATION_ITEMS` (recomendado)
```typescript
{
  id: 'nueva-ruta',
  label: 'Nueva Ruta',
  icon: IconName,
  route: '/nueva-ruta',
}
```

2. **Opción 2:** Agregar metadata en la configuración de rutas
```typescript
{
  path: 'nueva-ruta',
  loadComponent: () => import('...'),
  data: { breadcrumb: 'Nueva Ruta' },
}
```

## Características

✅ **Automático:** Se actualiza automáticamente con cada navegación
✅ **Reactivo:** Usa signals de Angular para máxima performance
✅ **Accesible:** Incluye atributos ARIA y navegación por teclado
✅ **Responsive:** Adaptado para móviles y tablets
✅ **Standalone:** Componente independiente sin módulos
✅ **Tipado:** TypeScript completo con interfaces

## Mejoras Futuras

- [ ] Soporte para breadcrumbs dinámicos con parámetros de ruta
- [ ] Iconos personalizados por breadcrumb
- [ ] Animaciones de transición
- [ ] Modo compacto para móviles (solo mostrar último breadcrumb)
- [ ] Dropdown para breadcrumbs largos
