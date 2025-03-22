import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../../common/status.enum';
import { Exclude } from 'class-transformer';
import { Line } from '../../line/entities/line.entity';

@Entity('area')
export class Area {
  @PrimaryColumn({ name: 'id', unique: true }) id: number;
  @Column({ length: 50 }) name: string;
  @Column({ unique: true, length: 50 }) alias: string;
  @ManyToOne(() => Line) @JoinColumn({ name: 'line_id' }) line: Line;
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.OK })
  status: StatusEnum;
  @CreateDateColumn() @Exclude() created_at: Date;
  @UpdateDateColumn() @Exclude() updated_at: Date;
}
