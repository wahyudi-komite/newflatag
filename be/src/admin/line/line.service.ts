import { Injectable } from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { AbstractService } from '../../common/abstract.service';
import { Line } from './entities/line.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LineService extends AbstractService {
  constructor(
    @InjectRepository(Line) private readonly _repository: Repository<Line>,
  ) {
    super(_repository);
  }
}
