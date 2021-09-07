import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionProductoComponent } from './presentacion-producto.component';

describe('PresentacionProductoComponent', () => {
  let component: PresentacionProductoComponent;
  let fixture: ComponentFixture<PresentacionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentacionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
