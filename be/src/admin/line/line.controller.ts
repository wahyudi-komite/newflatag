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
  Res,
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

  private async getData(request, isExport = false): Promise<any> {
    const returnData = await this._service.paginate(tabel, [], {
      limit: isExport ? 1000000 : request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: [
        tabel + '.id',
        tabel + '.name',
        tabel + '.alias',
        tabel + '.status',
      ],
    });

    returnData.data = returnData.data.map((item) => ({
      ...item,
      // create: formatDate(new Date(item.create)),
      // timejob: formatDate(new Date(item.timejob)),
    }));

    return returnData;
  }

  @Post()
  async create(@Body() createLineDto: CreateLineDto) {
    const existingName = await this._service.findOne({
      name: createLineDto.name,
    });
    if (existingName) {
      throw new ConflictException(
        `Name "${createLineDto.name}" already exists.`,
      );
    }

    const existingAlias = await this._service.findOne({
      alias: createLineDto.alias,
    });
    if (existingAlias) {
      throw new ConflictException(
        `Alias "${createLineDto.alias}" already exists.`,
      );
    }

    return this._service.create(createLineDto);
  }

  @Post('findName')
  get(@Body() data: any) {
    return this._service.findOne(data);
  }

  @Get()
  @HasPermission('line')
  async findAll(@Request() request) {
    return this.getData(request);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Cek apakah `name` sudah ada dengan ID berbeda
    const duplicateName = await this._service.findOne({
      name: updateLineDto.name,
    });

    if (duplicateName && duplicateName.id !== +id) {
      throw new ConflictException(
        `Name "${updateLineDto.name}" already exists.`,
      );
    }

    // Cek apakah `alias` sudah ada dengan ID berbeda
    const duplicateAlias = await this._service.findOne({
      alias: updateLineDto.alias,
    });

    if (duplicateAlias && duplicateAlias.id !== +id) {
      throw new ConflictException(
        `Alias "${updateLineDto.alias}" already exists.`,
      );
    }

    return this._service.update(+id, updateLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._service.remove(+id);
  }

  @Get('excel')
  async exportExcel(@Res() res: Response, @Request() request) {
    const returnData = await this.getData(request, true);
    await this._service.exportDataToExcel(returnData.data, res);
  }
}
