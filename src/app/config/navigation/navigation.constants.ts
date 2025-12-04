import {
  Users,
  UserCog,
  ChartColumn,
  Settings,
  Coins,
} from 'lucide-angular';

import { PRIVATE_ROUTES } from '../routes.config';

import type { NavigationItem } from './navigation-item.interface';

/**
 * Configuración de navegación principal de la aplicación
 * Separada del componente para facilitar mantenimiento y testing
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 1,
    key: 'users',
    name: 'Usuarios',
    label: 'Usuarios',
    icon: Users,
    permissions: [
      {
        id: 3,
        key: 'view',
        name: 'Ver',
      },
    ],
    children: [
      {
        id: 5,
        key: 'user-management',
        name: 'Gestión de Usuarios',
        label: 'Gestión de Usuarios',
        icon: UserCog,
        route: '/users/management',
        permissions: [
          { id: 1, key: 'create', name: 'Crear' },
          { id: 3, key: 'view', name: 'Ver' },
          { id: 4, key: 'edit', name: 'Editar' },
          { id: 5, key: 'list', name: 'Listar' },
        ],
      },
      {
        id: 6,
        key: 'user-reports',
        name: 'Reportes de Usuarios',
        label: 'Reportes de Usuarios',
        icon: ChartColumn,
        route: '/users/reports',
        permissions: [
          { id: 3, key: 'view', name: 'Ver' },
          { id: 6, key: 'export', name: 'Exportar' },
        ],
      },
    ],
  },
  {
    id: 'cia',
    label: 'Cia',
    icon: Coins,
    route: `/${PRIVATE_ROUTES.CIA}`,
    children: [
      {
        id: 'cia-subitem-1',
        label: 'Propuestas',
        icon: Coins,
        route: `/${PRIVATE_ROUTES.CIA}/propuestas`,
        permissions: [
          { id: 3, key: 'view', name: 'Ver' },
          { id: 4, key: 'edit', name: 'Editar' },
        ],
      },
      {
        id: 'cia-subitem-2',
        label: 'Reportes',
        icon: Coins,
        route: `/${PRIVATE_ROUTES.CIA}/reportes`,
      },
      {
        id: 'cia-subitem-3',
        label: 'Auditoría',
        icon: Coins,
        route: `/${PRIVATE_ROUTES.CIA}/auditoria`,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    route: `/${PRIVATE_ROUTES.SETTINGS}`,
    permissions: [
      { id: 3, key: 'view', name: 'Ver' },
      { id: 4, key: 'edit', name: 'Editar' },
    ],
  },
];
