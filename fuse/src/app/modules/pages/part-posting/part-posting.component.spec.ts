import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartPostingComponent } from './part-posting.component';

describe('PartPostingComponent', () => {
  let component: PartPostingComponent;
  let fixture: ComponentFixture<PartPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartPostingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
