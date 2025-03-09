import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { AbstractService } from '../../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from './entities/machine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MachineService extends AbstractService {
  constructor(
    @InjectRepository(Machine)
    private readonly _repository: Repository<Machine>,
  ) {
    super(_repository);
  }
}
