import { Area } from '../area/area';
import { Line } from '../line/line';

export interface QueryProduction {
    id: number;
    create: Date;
    line: Line;
    mc: number;
    uniq: string;
    eg: string;
    shift: string;
    working: Date;
    area: Area;
}
