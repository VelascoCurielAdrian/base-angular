import { Injectable, inject, computed } from '@angular/core';

import type { Module, Permission } from '@models/auth.interface';

import { AuthService } from './auth.service';

/**
 * Servicio para gestionar y verificar permisos de usuario
 */
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly _authService = inject(AuthService);

  // Señales computadas para acceso rápido
  public readonly permissions = computed(() => this._authService.permissions());
  public readonly hasAnyPermission = computed(() => this.permissions().length > 0);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  public can(moduleKey: string, permissionKey: string, subModuleKey?: string): boolean {
    return this._authService.hasPermission(moduleKey, permissionKey, subModuleKey);
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   */
  public canAny(checks: { module: string; permission: string; subModule?: string }[]): boolean {
    return checks.some(check =>
      this.can(check.module, check.permission, check.subModule),
    );
  }

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  public canAll(checks: { module: string; permission: string; subModule?: string }[]): boolean {
    return checks.every(check =>
      this.can(check.module, check.permission, check.subModule),
    );
  }

  /**
   * Verifica si el usuario puede crear en un módulo
   */
  public canCreate(moduleKey: string, subModuleKey?: string): boolean {
    return this.can(moduleKey, 'create', subModuleKey);
  }

  /**
   * Verifica si el usuario puede ver en un módulo
   */
  public canView(moduleKey: string, subModuleKey?: string): boolean {
    return this.can(moduleKey, 'view', subModuleKey);
  }

  /**
   * Verifica si el usuario puede editar en un módulo
   */
  public canEdit(moduleKey: string, subModuleKey?: string): boolean {
    return this.can(moduleKey, 'edit', subModuleKey);
  }

  /**
   * Verifica si el usuario puede eliminar en un módulo
   */
  public canDelete(moduleKey: string, subModuleKey?: string): boolean {
    return this.can(moduleKey, 'delete', subModuleKey);
  }

  /**
   * Verifica si el usuario puede listar en un módulo
   */
  public canList(moduleKey: string, subModuleKey?: string): boolean {
    return this.can(moduleKey, 'list', subModuleKey);
  }

  /**
   * Verifica si el usuario puede exportar en un módulo
   */
  public canExport(moduleKey: string, subModuleKey?: string): boolean {
    return this.can(moduleKey, 'export', subModuleKey);
  }

  /**
   * Obtiene todos los módulos disponibles
   */
  public getModules(): Module[] {
    return this.permissions();
  }

  /**
   * Obtiene un módulo específico por su key
   */
  public getModule(moduleKey: string): Module | undefined {
    return this.permissions().find(m => m.key === moduleKey);
  }

  /**
   * Obtiene los permisos de un módulo específico
   */
  public getModulePermissions(moduleKey: string): Permission[] {
    return this._authService.getModulePermissions(moduleKey);
  }

  /**
   * Verifica si el usuario tiene acceso a un módulo (sin importar permisos específicos)
   */
  public hasModuleAccess(moduleKey: string): boolean {
    return this._authService.hasModuleAccess(moduleKey);
  }

  /**
   * Obtiene las keys de todos los módulos a los que el usuario tiene acceso
   */
  public getAccessibleModules(): string[] {
    return this.permissions().map(m => m.key);
  }

  /**
   * Log de permisos para debugging
   */
  // public logPermissions(): void {
  //   const modules = this.permissions();
  //   console.group('🔐 Permisos del usuario');
  //   modules.forEach(module => {
  //     console.group(`📦 ${module.name} (${module.key})`);
  //     console.log('Permisos:', module.permissions.map(p => p.name).join(', '));

  //     if (module.children && module.children.length > 0) {
  //       console.group('📁 Submódulos:');
  //       module.children.forEach(child => {
  //         console.log(`  - ${child.name} (${child.key}):`, child.permissions.map(p => p.name).join(', '));
  //       });
  //       console.groupEnd();
  //     }

  //     console.groupEnd();
  //   });
  //   console.groupEnd();
  // }
}
