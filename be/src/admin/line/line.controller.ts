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
  Put,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LineService } from './line.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { HasPermission } from '../../permissions/has-permission.decorator';

const tabel = 'line';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('line')
export class LineController {
  constructor(private readonly _service: LineService) {}

  @Post()
  create(@Body() createLineDto: CreateLineDto) {
    return this._service.create(createLineDto);
  }

  @Get()
  @HasPermission('roles')
  async findAll(@Request() request) {
    return this._service.paginate(tabel, [], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: [tabel + '.name', tabel + '.alias'],
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    const duplicate = await this._service.findOne({ name: updateLineDto.name });
    if (duplicate && duplicate.id !== id) {
      throw new ConflictException(`${updateLineDto.name} Already Exist`);
    }
    return this._service.update(+id, updateLineDto);
  }
}
// @Get()
// findAll() {
//   return this.lineService.findAll();s
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.lineService.findOne(+id);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.lineService.remove(+id);
// }
