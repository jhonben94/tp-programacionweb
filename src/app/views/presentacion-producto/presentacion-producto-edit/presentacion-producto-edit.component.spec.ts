import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionProductoEditComponent } from './presentacion-producto-edit.component';

describe('PresentacionProductoEditComponent', () => {
  let component: PresentacionProductoEditComponent;
  let fixture: ComponentFixture<PresentacionProductoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionProductoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentacionProductoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
