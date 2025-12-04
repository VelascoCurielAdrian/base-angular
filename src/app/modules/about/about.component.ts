import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about">
      <div class="about__header">
        <h1 class="about__title">Acerca de</h1>
        <p class="about__subtitle">Sistema de Gestión de Servicios Corporativos</p>
      </div>

      <div class="about__content">
        <section class="about__section">
          <h2>Nuestra Misión</h2>
          <p>
            Proporcionar una plataforma integrada y eficiente para la gestión de servicios
            corporativos, facilitando la comunicación entre empleados y el departamento de TI.
          </p>
        </section>

        <section class="about__section">
          <h2>Características Principales</h2>
          <ul class="about__list">
            <li>Gestión de solicitudes de servicio</li>
            <li>Sistema de tickets y seguimiento</li>
            <li>Reporte de incidencias técnicas</li>
            <li>Portal de contacto y soporte</li>
            <li>Dashboard personalizado por usuario</li>
          </ul>
        </section>

        <section class="about__section">
          <h2>Información del Sistema</h2>
          <div class="about__info-grid">
            <div class="about__info-item">
              <strong>Versión:</strong>
              <span>1.0.0</span>
            </div>
            <div class="about__info-item">
              <strong>Última actualización:</strong>
              <span>Diciembre 2025</span>
            </div>
            <div class="about__info-item">
              <strong>Desarrollado por:</strong>
              <span>Grupo Coppel - Departamento TI</span>
            </div>
            <div class="about__info-item">
              <strong>Soporte:</strong>
              <span>soporte@coppel.com</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  public readonly version = '1.0.0';
}
