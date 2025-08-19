import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { EmployeeKao } from './entities/employee_kao.entity';

@Injectable()
export class EmployeeKaosService extends AbstractService {
  constructor(
    @InjectRepository(EmployeeKao)
    private readonly _repository: Repository<EmployeeKao>,
  ) {
    super(_repository);
  }
}
