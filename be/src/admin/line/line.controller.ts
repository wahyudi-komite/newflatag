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
}

// @Post()
// create(@Body() createLineDto: CreateLineDto) {
//   return this.lineService.create(createLineDto);
// }

// @Get()
// findAll() {
//   return this.lineService.findAll();
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.lineService.findOne(+id);
// }

// @Patch(':id')
// update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
//   return this.lineService.update(+id, updateLineDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.lineService.remove(+id);
// }
