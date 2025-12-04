import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { ContactInfo } from '@models/index';

@Component({
  selector: 'app-info-card',
  standalone: true,
  template: `
    <div class="info-card">
      <h4 class="info-card__title">{{ info().title }}</h4>
      @for (item of info().items; track item.label) {
      <p class="info-card__item">
        <strong>{{ item.label }}:</strong> {{ item.value }}
      </p>
      }
    </div>
  `,
  styleUrls: ['./info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  public readonly info = input.required<ContactInfo>();
}
