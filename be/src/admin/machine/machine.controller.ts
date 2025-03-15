import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ConflictException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { HasPermission } from '../../permissions/has-permission.decorator';
import { capitalize } from '../../common/utils/string.util';

const tabel = 'machine';
const columns = ['id', 'machine_no', 'machine_name', 'status'].map(
  (col) => `${tabel}.${col}`,
);
const lineColumns = ['name'].map((col) => `line.${col}`);
const areaColumns = ['name'].map((col) => `area.${col}`);

const allColumns = [...columns, ...lineColumns, ...areaColumns];

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('machine')
@Controller('machine')
export class MachineController {
  constructor(private readonly _service: MachineService) {}

  private async getData(request, isExport = false): Promise<any> {
    const returnData = await this._service.paginate(
      tabel,
      [
        [tabel + '.line', 'line'],
        [tabel + '.area', 'area'],
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
  async create(@Body() createDto: CreateMachineDto) {
    const existingName = await this._service.findOne({
      machine_no: createDto.machine_no,
    });
    if (existingName) {
      throw new ConflictException(
        `No "${createDto.machine_no}" already exists.`,
      );
    }

    createDto.machine_name = capitalize(createDto.machine_name);
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
  async update(@Param('id') id: string, @Body() updateDto: UpdateMachineDto) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Cek apakah `name` sudah ada dengan ID berbeda
    const duplicateName = await this._service.findOne({
      machine_no: updateDto.machine_no,
    });

    if (duplicateName && duplicateName.id !== +id) {
      throw new ConflictException(
        `Name "${updateDto.machine_no}" already exists.`,
      );
    }
    console.log(updateDto);

    updateDto.machine_name = capitalize(updateDto.machine_name);
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
