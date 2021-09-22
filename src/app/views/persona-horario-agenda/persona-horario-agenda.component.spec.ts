import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaHorarioAgendaComponent } from './persona-horario-agenda.component';

describe('PersonaHorarioAgendaComponent', () => {
  let component: PersonaHorarioAgendaComponent;
  let fixture: ComponentFixture<PersonaHorarioAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonaHorarioAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaHorarioAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
