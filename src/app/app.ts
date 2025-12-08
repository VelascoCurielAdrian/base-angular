import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GlobalLoadingComponent } from '@shared/global-loading/global-loading.component';
import { ToastContainerComponent } from '@shared/toast-container/toast-container.component';

import { GlobalLoadingService } from '@services/global-loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoadingComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly _globalLoading = inject(GlobalLoadingService);

  protected readonly title = signal('front-menu-cia');
  protected readonly isLoading = computed(() => this._globalLoading.isLoading());
}
