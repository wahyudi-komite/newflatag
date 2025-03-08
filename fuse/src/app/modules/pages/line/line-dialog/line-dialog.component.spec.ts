import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDialogComponent } from './line-dialog.component';

describe('LineDialogComponent', () => {
  let component: LineDialogComponent;
  let fixture: ComponentFixture<LineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
