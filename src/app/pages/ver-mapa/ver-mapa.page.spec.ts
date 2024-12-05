import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerMapaPage } from './ver-mapa.page';

describe('VerMapaPage', () => {
  let component: VerMapaPage;
  let fixture: ComponentFixture<VerMapaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
