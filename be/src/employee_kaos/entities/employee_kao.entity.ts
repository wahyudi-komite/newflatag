import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employee_kaos' })
export class EmployeeKao {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  divisi: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 50, name: 'lokasiKerja' })
  lokasiKerja: string;

  @Column({ type: 'char', length: 1 })
  status: string;

  @Column({ type: 'char', length: 1 })
  gender: string;

  @Column({ type: 'varchar', length: 5, name: 'family_stats' })
  family_stats: string;

  @Column({ type: 'varchar', length: 20, name: 'no_wa' })
  no_wa: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_employee1' })
  kaos_employee1: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_spouse1' })
  kaos_spouse1: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_child1' })
  kaos_child1: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_child2' })
  kaos_child2: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_child3' })
  kaos_child3: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_child4' })
  kaos_child4: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_child5' })
  kaos_child5: string;

  @Column({ type: 'varchar', length: 50, name: 'kaos_child6' })
  kaos_child6: string;

  @Column({ type: 'int' })
  souvenir: number;

  @Column({ type: 'varchar', length: 2 })
  plant: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dlong: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dshort: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  clong: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  cshort: string;

  @Column({ type: 'int', default: 0 })
  scan: number;

  @Column({ nullable: true, default: null })
  scan_date: Date | null;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @Column({ type: 'enum', enum: ['YES', 'NO'], default: 'NO' })
  terminated: 'YES' | 'NO';

  @Column({ type: 'varchar', length: 100, nullable: true })
  section: string;

  @Column({ type: 'int', nullable: true })
  golongan: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  jabatan: number;

  @Column({ type: 'enum', enum: ['Expatriate', 'Local'], default: 'Local' })
  expatriat: string;

  @Column({
    type: 'enum',
    enum: ['NON SHIFT', 'SHIFT A', 'SHIFT B'],
    nullable: true,
  })
  shift: string;
}
