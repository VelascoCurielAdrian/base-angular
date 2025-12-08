import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  template: `
    <div class="global-loading-overlay">
      <div class="loading-container">
        <img src="logo.svg" alt="Cargando..." class="loading-logo" />
        <p class="loading-text">Cargando...</p>
      </div>
    </div>
  `,
  styleUrls: ['./global-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoadingComponent {
  public title = 'front-menu-cia';
}
