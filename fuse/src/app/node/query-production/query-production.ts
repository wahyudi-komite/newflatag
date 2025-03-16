import { Line } from '../line/line';
import { Machine } from '../machine/machine';

export interface QueryProduction {
    id: number;
    create: Date;
    line: Line;
    areamc: number;
    uniq: string;
    eg: string;
    shift: string;
    working: Date;
    machine: Machine;
}
