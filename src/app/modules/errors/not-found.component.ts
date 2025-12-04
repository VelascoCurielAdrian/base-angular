import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LucideAngularModule, SearchX, Home, ArrowLeft, Phone, Mail } from 'lucide-angular';

import { PRIVATE_ROUTES } from '../../config/routes.config';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  protected readonly homeRoute = `/${PRIVATE_ROUTES.HOME}`;
  protected readonly errorCode = 'SD_692F67AA46B33';

  // Iconos
  protected readonly icons = {
    SearchX,
    Home,
    ArrowLeft,
    Phone,
    Mail,
  };

  protected goBack(): void {
    window.history.back();
  }
}
