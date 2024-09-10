import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarFormularioPage } from './confirmar-formulario.page';

describe('ConfirmarFormularioPage', () => {
  let component: ConfirmarFormularioPage;
  let fixture: ComponentFixture<ConfirmarFormularioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarFormularioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
