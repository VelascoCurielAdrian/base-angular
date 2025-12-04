import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cia-reportes',
  imports: [],
  templateUrl: './cia-reportes.html',
  styleUrl: './cia-reportes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CiaReportes {
  public title = 'CIA - Reportes';
}
