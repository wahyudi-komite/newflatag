import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AuthGuard } from '@nestjs/passport';
import { HasPermission } from '../../permissions/has-permission.decorator';

const tabel = 'area';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('area')
export class AreaController {
  constructor(private readonly _service: AreaService) {}

  @Get()
  async findAll(@Request() request) {
    return this._service.paginate(tabel, [], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: [tabel + '.area', tabel + '.alias'],
    });
  }
}
