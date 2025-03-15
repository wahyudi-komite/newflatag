import { Machine } from '../machine/machine';
import { Part } from '../part/part';

export interface PartPosting {
    id: number;
    part: Part;
    machine: Machine;
    uniq: number;
    qty: number;
}
