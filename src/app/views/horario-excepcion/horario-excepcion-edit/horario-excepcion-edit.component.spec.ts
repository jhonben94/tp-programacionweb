import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioExcepcionEditComponent } from './horario-excepcion-edit.component';

describe('HorarioExcepcionEditComponent', () => {
  let component: HorarioExcepcionEditComponent;
  let fixture: ComponentFixture<HorarioExcepcionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioExcepcionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioExcepcionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
