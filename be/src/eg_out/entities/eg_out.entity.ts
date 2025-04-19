import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from '../../admin/line/entities/line.entity';
import { Area } from '../../admin/area/entities/area.entity';

@Entity()
export class EgOut {
  @PrimaryGeneratedColumn() id: number;
  @CreateDateColumn({ type: 'datetime', precision: 6 }) create: Date;
  @ManyToOne(() => Line) @JoinColumn({ name: 'line_id' }) line: Line;
  @Column() mc: number;
  @Column({ length: 4 }) uniq: string;
  @Column() uniq_area: number;
  @Column({ length: 12 }) eg: string;
  @ManyToOne(() => Area) @JoinColumn({ name: 'area_id' }) area: Area;
  @Column({ type: 'date' }) working: Date;
  @Column({ length: 5 }) shift: string;
}
