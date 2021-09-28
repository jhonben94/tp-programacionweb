import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteServicioComponent } from './reporte-servicio.component';

describe('ReporteServicioComponent', () => {
  let component: ReporteServicioComponent;
  let fixture: ComponentFixture<ReporteServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
