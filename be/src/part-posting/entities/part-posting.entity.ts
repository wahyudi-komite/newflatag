import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Part } from '../../part/entities/part.entity';
import { Line } from '../../admin/line/entities/line.entity';
import { Area } from '../../admin/area/entities/area.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class PartPosting {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Part) @JoinColumn({ name: 'part_id' }) part: Part;
  @ManyToOne(() => Line) @JoinColumn({ name: 'line_id' }) line: Line;
  @ManyToOne(() => Area) @JoinColumn({ name: 'area_id' }) area: Area;
  @Column({ name: 'uniq', unique: true }) uniq: number;
  @Column({ name: 'qty' }) qty: number;
  @CreateDateColumn() @Exclude() created_at: Date;
  @UpdateDateColumn() @Exclude() updated_at: Date;
}
