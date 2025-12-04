import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ChevronRight, LucideAngularModule } from 'lucide-angular';

import { BreadcrumbService } from '@services/breadcrumb.service';

/**
 * Componente de breadcrumbs para navegación jerárquica
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, NgClass, LucideAngularModule],
  template: `
    <nav class="breadcrumb" aria-label="breadcrumb">
      <ol class="breadcrumb__list">
        @for (crumb of breadcrumbs(); track crumb.label; let isLast = $last) {
          <li
            class="breadcrumb__item"
            [ngClass]="{ 'breadcrumb__item--active': crumb.isActive }"
          >
            @if (!isLast && crumb.url) {
              <a
                [routerLink]="crumb.url"
                class="breadcrumb__link"
              >
                {{ crumb.label }}
              </a>
            } @else {
              <span class="breadcrumb__text">{{ crumb.label }}</span>
            }

            @if (!isLast) {
              <lucide-icon
                [img]="ChevronRight"
                class="breadcrumb__separator"
                [size]="16"
              />
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  private readonly _breadcrumbService = inject(BreadcrumbService);

  protected readonly breadcrumbs = this._breadcrumbService.breadcrumbs;
  protected readonly ChevronRight = ChevronRight;
}
