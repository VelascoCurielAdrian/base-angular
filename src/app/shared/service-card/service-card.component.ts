import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { ServiceCard } from '@models/index';

@Component({
  selector: 'app-service-card',
  standalone: true,
  template: `
    <div class="service-card" (click)="cardClick.emit(service())">
      <div class="service-card__icon">{{ service().icon }}</div>
      <h3 class="service-card__title">{{ service().title }}</h3>
      <p class="service-card__description">{{ service().description }}</p>
      <button type="button" class="service-card__button">
        {{ buttonText() }}
      </button>
    </div>
  `,
  styleUrls: ['./service-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent {
  public readonly service = input.required<ServiceCard>();
  public readonly buttonText = input<string>('Ir');
  public readonly cardClick = output<ServiceCard>();
}
