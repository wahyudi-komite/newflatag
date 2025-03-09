import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

const tabel = 'machine';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('machine')
export class MachineController {
  constructor(private readonly _service: MachineService) {}

  @Get()
  async findAll(@Request() request) {
    return this._service.paginate(
      tabel,
      [
        [tabel + '.line', 'line'],
        [tabel + '.area', 'area'],
      ],
      {
        limit: request.query.limit,
        page: request.query.page,
        sort: request.query.sort,
        direction: request.query.direction,
        keyword: request.query.keyword,
        column: [
          tabel + '.machine_no',
          tabel + '.machine_name',
          tabel + '.status',
        ],
      },
    );
  }
}
