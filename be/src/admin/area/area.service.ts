import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AbstractService } from '../../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService extends AbstractService {
  constructor(
    @InjectRepository(Area) private readonly _repository: Repository<Area>,
  ) {
    super(_repository);
  }
}
