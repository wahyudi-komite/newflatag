import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
  Res,
  ConflictException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { PartPostingService } from './part-posting.service';
import { CreatePartPostingDto } from './dto/create-part-posting.dto';
import { UpdatePartPostingDto } from './dto/update-part-posting.dto';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';

const tabel = 'part_posting';
const columns = ['id', 'uniq', 'qty'].map((col) => `${tabel}.${col}`);
const lineColumns = ['name'].map((col) => `line.${col}`);
const areaColumns = ['name'].map((col) => `area.${col}`);
const partColumns = ['part_no', 'part_name'].map((col) => `part.${col}`);
const machineColumns = ['machine_no', 'machine_name'].map(
  (col) => `machine.${col}`,
);

const allColumns = [
  ...columns,
  ...partColumns,
  ...machineColumns,
  ...lineColumns,
  ...areaColumns,
];

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('part-posting')
@Controller('part-posting')
export class PartPostingController {
  constructor(private readonly _service: PartPostingService) {}

  private async getData(request, isExport = false): Promise<any> {
    const returnData = await this._service.paginate(
      tabel,
      [
        [tabel + '.part', 'part'],
        [tabel + '.machine', 'machine'],
        ['machine.area', 'area'],
        ['machine.line', 'line'],
      ],
      {
        limit: isExport ? 1000000 : request.query.limit,
        page: request.query.page,
        sort: request.query.sort,
        direction: request.query.direction,
        keyword: request.query.keyword,
        column: allColumns,
      },
    );

    returnData.data = returnData.data.map((item) => ({
      ...item,
      // create: formatDate(new Date(item.create)),
      // timejob: formatDate(new Date(item.timejob)),
    }));

    return returnData;
  }

  @Post()
  async create(@Body() createDto: CreatePartPostingDto) {
    // const existingName = await this._service.findOne({
    //   machine_no: createDto.machine_no,
    // });
    // if (existingName) {
    //   throw new ConflictException(
    //     `No "${createDto.machine_no}" already exists.`,
    //   );
    // }

    // const existingAlias = await this._service.findOne({
    //   machine_name: createDto.machine_name,
    // });
    // if (existingAlias) {
    //   throw new ConflictException(
    //     `Alias "${createDto.machine_name}" already exists.`,
    //   );
    // }

    // createDto.machine_name = capitalize(createDto.machine_name);
    return this._service.create(createDto);
  }

  @Post('findName')
  get(@Body() data: any) {
    return this._service.findOne(data);
  }

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePartPostingDto,
  ) {
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
    // updateDto.name = capitalize(updateDto.name);
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
