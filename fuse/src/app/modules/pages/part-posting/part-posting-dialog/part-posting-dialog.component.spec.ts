import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartPostingDialogComponent } from './part-posting-dialog.component';

describe('PartPostingDialogComponent', () => {
  let component: PartPostingDialogComponent;
  let fixture: ComponentFixture<PartPostingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartPostingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartPostingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
