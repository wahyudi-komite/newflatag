import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GlobalVariable } from '../../../node/common/global-variable';
import { EmployeeKaosService } from '../employee-kaos/employee-kaos.service';

@Component({
    selector: 'app-scan-data',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './scan-data.component.html',
    styleUrl: './scan-data.component.scss',
})
export class ScanDataComponent implements OnInit {
    form!: FormGroup;

    @ViewChild('scan', { static: false }) scan!: ElementRef;

    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private _service = inject(EmployeeKaosService);

    ngOnInit(): void {
        this.form = this.fb.group({
            scan: ['', [Validators.required]],
        });
    }
    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    errorNotif(error: any) {
        const message = error?.error?.message || 'Unknown error';

        if (message.toLowerCase().includes('print')) {
            GlobalVariable.audioInfo.play();
            this.toastr.info(message, 'Info', {
                timeOut: 5000,
                positionClass: 'toast-bottom-center',
            });
        } else {
            GlobalVariable.audioFailed.play();
            this.toastr.error(message, 'Failed', {
                timeOut: 5000,
                positionClass: 'toast-bottom-center',
            });
        }
    }

    setFocus() {
        this.scan.nativeElement.focus();
    }

    resetForm() {
        this.form.reset();
        this.form.markAsUntouched();
        this.form.markAsPristine();
        this.setFocus();
    }
    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this._service.updateScan(this.form.getRawValue()).subscribe(
            (res) => {
                GlobalVariable.audioSuccess.play();
                this.toastr.success('Success', res.id + ' ' + res.name, {
                    timeOut: 2000,
                    positionClass: 'toast-bottom-center',
                });
                this.form.reset();

                this.form.markAsUntouched();
                this.form.markAsPristine();
                this.setFocus();
            },
            (error) => {
                this.errorNotif(error);
            }
        );
    }
}
