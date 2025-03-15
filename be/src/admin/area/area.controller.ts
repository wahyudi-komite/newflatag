import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
  Request,
  ConflictException,
  NotFoundException,
  Res,
  Put,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { HasPermission } from '../../permissions/has-permission.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { capitalize } from '../../common/utils/string.util';

const tabel = 'area';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('area')
@Controller('area')
export class AreaController {
  constructor(private readonly _service: AreaService) {}

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
  async create(@Body() createAreaDto: CreateAreaDto) {
    const existingName = await this._service.findOne({
      name: createAreaDto.name,
    });
    if (existingName) {
      throw new ConflictException(
        `Name "${createAreaDto.name}" already exists.`,
      );
    }

    const existingAlias = await this._service.findOne({
      alias: createAreaDto.alias,
    });
    if (existingAlias) {
      throw new ConflictException(
        `Alias "${createAreaDto.alias}" already exists.`,
      );
    }

    createAreaDto.name = capitalize(createAreaDto.name);
    return this._service.create(createAreaDto);
  }

  @Post('findName')
  get(@Body() data: any) {
    return this._service.findOne(data);
  }

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }

  @Get('all')
  async all(@Request() request) {
    return this._service.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
      field: request.query.field,
      keyword: request.query.keyword,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateAreaDto) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Cek apakah `name` sudah ada dengan ID berbeda
    const duplicateName = await this._service.findOne({
      name: updateDto.name,
    });

    if (duplicateName && duplicateName.id !== +id) {
      throw new ConflictException(`Name "${updateDto.name}" already exists.`);
    }

    // Cek apakah `alias` sudah ada dengan ID berbeda
    const duplicateAlias = await this._service.findOne({
      alias: updateDto.alias,
    });

    if (duplicateAlias && duplicateAlias.id !== +id) {
      throw new ConflictException(`Alias "${updateDto.alias}" already exists.`);
    }
    updateDto.name = capitalize(updateDto.name);
    return this._service.update(+id, updateDto);
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
