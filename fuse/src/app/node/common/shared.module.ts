import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { PaginateTakeComponent } from '../../modules/shared/paginate-take/paginate-take.component';
import { PaginateComponent } from '../../modules/shared/paginate/paginate.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        PaginateComponent,
        PaginateTakeComponent,
    ],
    exports: [
        CommonModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        PaginateComponent,
        PaginateTakeComponent,
        DatePipe,
    ],
    providers: [DatePipe],
})
export class SharedModule {}
