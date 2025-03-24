import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDialogUploadComponent } from './part-dialog-upload.component';

describe('PartDialogUploadComponent', () => {
  let component: PartDialogUploadComponent;
  let fixture: ComponentFixture<PartDialogUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartDialogUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartDialogUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
