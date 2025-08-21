import { Controller, Get, Request } from '@nestjs/common';
import { formatDate } from '../common/utils/date.utils';
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

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }
}
