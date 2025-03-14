import { StatusEnum } from '../common/status.enum';

export interface Area {
    id: number;
    name: string;
    alias: string;
    status: StatusEnum;
}
