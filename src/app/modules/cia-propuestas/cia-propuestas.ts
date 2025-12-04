import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cia-propuestas',
  imports: [],
  templateUrl: './cia-propuestas.html',
  styleUrls: ['./cia-propuestas.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CiaPropuestas {
  public title = 'CIA - Propuestas';
}
