import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../common/status.enum';

@Entity()
export class Part {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'part_no', unique: true, length: 50 }) part_no: string;
  @Column({ name: 'part_name', length: 100 }) part_name: string;
  @Column({ name: 'supplier', length: 100 }) supplier: string;
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.OK })
  status: StatusEnum;
  @CreateDateColumn() @Exclude() created_at: Date;
  @UpdateDateColumn() @Exclude() updated_at: Date;
}
