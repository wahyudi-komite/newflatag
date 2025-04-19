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
import { Area } from '../../admin/area/entities/area.entity';
import { Exclude } from 'class-transformer';
import { Machine } from '../../admin/machine/entities/machine.entity';

@Entity()
export class PartPosting {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => Part) @JoinColumn({ name: 'part_id' }) part: Part;
  @ManyToOne(() => Machine)
  @ManyToOne(() => Area)
  @JoinColumn({ name: 'area_id' })
  area: Area;
  @Column({ name: 'uniq' }) uniq: number;
  @Column() uniq_area: number;
  @Column({ name: 'qty' }) qty: number;
  @CreateDateColumn() @Exclude() created_at: Date;
  @UpdateDateColumn() @Exclude() updated_at: Date;
}
