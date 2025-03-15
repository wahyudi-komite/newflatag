import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AbstractService } from '../common/abstract.service';

@Injectable({
    providedIn: 'root',
})
export class PartService extends AbstractService {
    url = `${environment.apiUrl}/part`;
}
