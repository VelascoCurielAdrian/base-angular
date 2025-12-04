import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiaReportes } from './cia-reportes';

describe('CiaReportes', () => {
  let component: CiaReportes;
  let fixture: ComponentFixture<CiaReportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CiaReportes],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CiaReportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
