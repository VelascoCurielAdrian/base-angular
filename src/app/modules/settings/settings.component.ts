import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings">
      <h1>Configuración de la cuenta</h1>
    </div>
  `,
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly _authService = inject(AuthService);

  protected readonly currentUser = this._authService.account;
  protected readonly userEmail = this._authService.profile;
}
