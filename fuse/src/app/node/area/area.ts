import { StatusEnum } from '../common/status.enum';
import { Line } from '../line/line';

export interface Area {
    id: number;
    name: string;
    alias: string;
    line: Line;
    status: StatusEnum;
}
