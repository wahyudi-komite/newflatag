import { Injectable } from '@nestjs/common';
import { CreatePartPostingDto } from './dto/create-part-posting.dto';
import { UpdatePartPostingDto } from './dto/update-part-posting.dto';
import { AbstractService } from '../common/abstract.service';
import { PartPosting } from './entities/part-posting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PartPostingService extends AbstractService {
  constructor(
    @InjectRepository(PartPosting)
    private readonly _repository: Repository<PartPosting>,
  ) {
    super(_repository);
  }
}
