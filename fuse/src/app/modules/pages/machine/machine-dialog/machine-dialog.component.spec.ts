import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDialogComponent } from './machine-dialog.component';

describe('MachineDialogComponent', () => {
  let component: MachineDialogComponent;
  let fixture: ComponentFixture<MachineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
