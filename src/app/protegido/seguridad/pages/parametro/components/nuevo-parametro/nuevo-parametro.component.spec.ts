import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoParametroComponent } from './nuevo-parametro.component';

describe('NuevoParametroComponent', () => {
  let component: NuevoParametroComponent;
  let fixture: ComponentFixture<NuevoParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoParametroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
