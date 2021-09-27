import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaEditComponent } from './ficha-edit.component';

describe('FichaEditComponent', () => {
  let component: FichaEditComponent;
  let fixture: ComponentFixture<FichaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
