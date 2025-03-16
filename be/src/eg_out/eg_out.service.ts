import { Injectable } from '@nestjs/common';
import { CreateEgOutDto } from './dto/create-eg_out.dto';
import { UpdateEgOutDto } from './dto/update-eg_out.dto';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EgOut } from './entities/eg_out.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EgOutService extends AbstractService {
  constructor(
    @InjectRepository(EgOut) private readonly _repository: Repository<EgOut>,
  ) {
    super(_repository);
  }
}
