import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetContraPage } from './reset-contra.page';

describe('ResetContraPage', () => {
  let component: ResetContraPage;
  let fixture: ComponentFixture<ResetContraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
