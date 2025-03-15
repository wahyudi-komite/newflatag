import { Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from './entities/part.entity';

@Injectable()
export class PartService extends AbstractService {
  constructor(
    @InjectRepository(Part)
    private readonly _repository: Repository<Part>,
  ) {
    super(_repository);
  }
}
