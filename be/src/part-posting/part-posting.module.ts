import { Module } from '@nestjs/common';
import { PartPostingService } from './part-posting.service';
import { PartPostingController } from './part-posting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartPosting } from './entities/part-posting.entity';
import { CommonModule } from '../common/common.module';
import { Area } from '../admin/area/entities/area.entity';
import { Part } from '../part/entities/part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartPosting, Area, Part]), CommonModule],
  controllers: [PartPostingController],
  providers: [PartPostingService],
  exports: [PartPostingService],
})
export class PartPostingModule {}
