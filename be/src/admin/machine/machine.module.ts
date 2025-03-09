import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './entities/machine.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Machine]), CommonModule],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachineModule {}
