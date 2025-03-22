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
  UseGuards,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EgOutService } from './eg_out.service';
import { formatDate } from '../common/utils/date.utils';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';

const tabel = 'eg_out';
const columns = [`shift`, `id`, `create`, `mc`, `uniq`, `eg`, `working`].map(
  (col) => `${tabel}.${col}`,
);
const lineColumns = ['name'].map((col) => `line.${col}`);
const areaColumns = ['name', 'alias'].map((col) => `area.${col}`);
const allColumns = [...columns, ...lineColumns, ...areaColumns];

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('eg_out')
@Controller('eg-out')
export class EgOutController {
  constructor(private readonly _service: EgOutService) {}

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
      create: formatDate(new Date(item.create)),
    }));

    return returnData;
  }

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }
}
