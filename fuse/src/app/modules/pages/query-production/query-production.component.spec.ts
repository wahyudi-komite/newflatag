import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryProductionComponent } from './query-production.component';

describe('QueryProductionComponent', () => {
  let component: QueryProductionComponent;
  let fixture: ComponentFixture<QueryProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
