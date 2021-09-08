import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaHorarioAgendaEditComponent } from './persona-horario-agenda-edit.component';

describe('PersonaHorarioAgendaEditComponent', () => {
  let component: PersonaHorarioAgendaEditComponent;
  let fixture: ComponentFixture<PersonaHorarioAgendaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonaHorarioAgendaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaHorarioAgendaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
