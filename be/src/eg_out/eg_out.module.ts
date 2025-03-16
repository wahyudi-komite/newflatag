import { Module } from '@nestjs/common';
import { EgOutService } from './eg_out.service';
import { EgOutController } from './eg_out.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EgOut } from './entities/eg_out.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([EgOut]), CommonModule],
  controllers: [EgOutController],
  providers: [EgOutService],
  exports: [EgOutService],
})
export class EgOutModule {}
