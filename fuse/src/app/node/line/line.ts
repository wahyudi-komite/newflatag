import { StatusEnum } from '../common/status.enum';

export interface Line {
    id: number;
    name: string;
    alias: string;
    status: StatusEnum;
}
