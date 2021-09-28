import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteServicioDetalleComponent } from './reporte-servicio-detalle.component';

describe('ReporteServicioDetalleComponent', () => {
  let component: ReporteServicioDetalleComponent;
  let fixture: ComponentFixture<ReporteServicioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteServicioDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteServicioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
