import { Area } from '../area/area';
import { StatusEnum } from '../common/status.enum';
import { Line } from '../line/line';

export interface Machine {
    id: number;
    machineNo: string;
    machineName: string;
    line: Line;
    area: Area;
    status: StatusEnum;
}
