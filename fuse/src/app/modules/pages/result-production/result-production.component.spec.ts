import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultProductionComponent } from './result-production.component';

describe('ResultProductionComponent', () => {
  let component: ResultProductionComponent;
  let fixture: ComponentFixture<ResultProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
