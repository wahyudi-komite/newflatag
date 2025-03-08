import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../../common/status.enum';

@Entity()
export class Line {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true, length: 50 }) name: string;
  @Column({ unique: true, length: 4 }) alias: string;
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.OK })
  status: StatusEnum;
  @CreateDateColumn() @Exclude() created_at: Date;
  @UpdateDateColumn() @Exclude() updated_at: Date;
}
