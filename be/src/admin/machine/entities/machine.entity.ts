import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../../common/status.enum';
import { Exclude } from 'class-transformer';
import { Line } from '../../line/entities/line.entity';
import { Area } from '../../area/entities/area.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'machine_no', unique: true }) machine_no: string;
  @Column({ name: 'machine_name' }) machine_name: string;
  @ManyToOne(() => Line) @JoinColumn({ name: 'line_id' }) line: Line;
  @ManyToOne(() => Area) @JoinColumn({ name: 'area_id' }) area: Area;
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.OK })
  status: StatusEnum;
  @CreateDateColumn() @Exclude() created_at: Date;
  @UpdateDateColumn() @Exclude() updated_at: Date;
}
