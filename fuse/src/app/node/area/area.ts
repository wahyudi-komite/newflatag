import { StatusEnum } from '../common/status.enum';

export interface Area {
    id: number;
    area: string;
    alias: string;
    status: StatusEnum;
}
