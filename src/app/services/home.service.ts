import { Injectable, signal } from '@angular/core';

import type { ContactInfo, ServiceCard } from '@models/index';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly _services = signal<ServiceCard[]>([
    {
      id: 'requests',
      title: 'Solicitudes',
      description: 'Crea y gestiona tus solicitudes de servicio',
      icon: '📋',
      route: '/solicitudes',
    },
    {
      id: 'report',
      title: 'Reportar Falla',
      description: 'Reporta problemas técnicos o incidencias',
      icon: '🔧',
      route: '/reportar',
    },
    {
      id: 'tickets',
      title: 'Mis Tickets',
      description: 'Consulta el estado de tus tickets',
      icon: '📊',
      route: '/tickets',
    },
    {
      id: 'contact',
      title: 'Contacto',
      description: 'Obtén ayuda y soporte técnico',
      icon: '📞',
      route: '/contacto',
    },
  ]);

  private readonly _contactInfo = signal<ContactInfo[]>([
    {
      title: 'Información de Contacto',
      items: [
        { label: 'Extensión', value: '566911' },
        { label: 'Teléfono', value: '667 759 4220' },
      ],
    },
    {
      title: 'Horario de Atención',
      items: [
        { label: 'Lunes a Viernes', value: '8:00 AM - 6:00 PM' },
        { label: 'Sábados', value: '9:00 AM - 2:00 PM' },
      ],
    },
  ]);

  public readonly services = this._services.asReadonly();
  public readonly contactInfo = this._contactInfo.asReadonly();

  public getServiceById(id: string): ServiceCard | undefined {
    return this._services().find((service) => service.id === id);
  }

  public handleServiceAction(service: ServiceCard): void {
    if (service.action) {
      service.action();
    }
    // Aquí se puede agregar lógica adicional como navegación, analytics, etc.
    console.info(`Service clicked: ${service.id}`);
  }
}
