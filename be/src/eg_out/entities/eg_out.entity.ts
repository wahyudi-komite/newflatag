import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from '../../admin/line/entities/line.entity';
import { Machine } from '../../admin/machine/entities/machine.entity';
import { machine } from 'os';
import { forwardRef } from '@nestjs/common';

@Entity()
export class EgOut {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  create: Date;

  @Column()
  areamc: number;

  @Column({ length: 4 })
  uniq: string;

  @Column({ length: 12 })
  eg: string;

  @Column({ length: 5 })
  shift: string;

  @Column({ type: 'date' })
  working: Date;

  @ManyToOne(() => Line) @JoinColumn({ name: 'line' }) line: Line;
  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;
}
