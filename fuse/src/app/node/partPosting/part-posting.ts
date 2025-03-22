import { Area } from '../area/area';
import { Part } from '../part/part';

export interface PartPosting {
    id: number;
    part: Part;
    area: Area;
    uniq: number;
    qty: number;
}
