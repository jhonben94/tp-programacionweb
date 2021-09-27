import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorTipoProductoComponent } from './buscador-tipo-producto.component';

describe('BuscadorTipoProductoComponent', () => {
  let component: BuscadorTipoProductoComponent;
  let fixture: ComponentFixture<BuscadorTipoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorTipoProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorTipoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
