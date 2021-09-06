import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProductoEditComponent } from './tipo-producto-edit.component';

describe('TipoProductoEditComponent', () => {
  let component: TipoProductoEditComponent;
  let fixture: ComponentFixture<TipoProductoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoProductoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoProductoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
