import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryPartConsumeComponent } from './query-part-consume.component';

describe('QueryPartConsumeComponent', () => {
  let component: QueryPartConsumeComponent;
  let fixture: ComponentFixture<QueryPartConsumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryPartConsumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryPartConsumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
