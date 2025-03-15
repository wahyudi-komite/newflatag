import { StatusEnum } from '../common/status.enum';

export interface Part {
    id: number;
    part_no: string;
    part_name: string;
    supplier: string;
    status: StatusEnum;
}
