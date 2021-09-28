import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioExcepcionFisioComponent } from './horario-excepcion-fisio.component';

describe('HorarioExcepcionFisioComponent', () => {
  let component: HorarioExcepcionFisioComponent;
  let fixture: ComponentFixture<HorarioExcepcionFisioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioExcepcionFisioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioExcepcionFisioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
