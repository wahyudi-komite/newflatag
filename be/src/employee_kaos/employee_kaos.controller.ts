import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { formatDate } from '../common/utils/date.utils';
import { UpdateEmployeeKaoDto } from './dto/update-employee_kao.dto';
import { EmployeeKaosService } from './employee_kaos.service';

const tabel = 'employee_kaos';
const columns = [
  'id',
  'name',
  'divisi',
  'department',
  'lokasiKerja',
  'status',
  'gender',
  'family_stats',
  'no_wa',
  'kaos_employee1',
  'kaos_spouse1',
  'kaos_child1',
  'kaos_child2',
  'kaos_child3',
  'kaos_child4',
  'kaos_child5',
  'kaos_child6',
  'plant',
  'dlong',
  'dshort',
  'clong',
  'cshort',
  'souvenir',
  'created_at',
  'updated_at',
].map((col) => `${tabel}.${col}`);

@UseInterceptors(ClassSerializerInterceptor)
@Controller('employee-kaos')
export class EmployeeKaosController {
  constructor(private readonly _service: EmployeeKaosService) {}

  private async getData(request, isExport = false): Promise<any> {
    const returnData = await this._service.paginate(tabel, [], {
      limit: isExport ? 1000000 : request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: columns,
    });

    returnData.data = returnData.data.map((item) => ({
      ...item,
      created_at: formatDate(new Date(item.created_at)),
      updated_at: formatDate(new Date(item.updated_at)),
    }));

    return returnData;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEmployeeKaoDto,
  ) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Cek apakah `name` sudah ada dengan ID berbeda
    const duplicateName = await this._service.findOne({
      id: updateDto.id,
    });

    if (duplicateName && duplicateName.id !== +id) {
      throw new ConflictException(`"${updateDto.id}" already exists.`);
    }
    // updateDto.part_name = capitalize(updateDto.part_name);
    // updateDto.supplier = capitalize(updateDto.supplier);
    return this._service.update(+id, updateDto);
  }

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }
}
