import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioConductorPage } from './formulario-conductor.page';

describe('FormularioConductorPage', () => {
  let component: FormularioConductorPage;
  let fixture: ComponentFixture<FormularioConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
