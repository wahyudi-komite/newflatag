import {
  Controller,
  Get,
  Request,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
  Res,
} from '@nestjs/common';
import { EgOutService } from './eg_out.service';
import { formatDate } from '../common/utils/date.utils';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';

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
        filterParams: [
          { shift: request.query.shift ? request.query.shift : '' },
          { line: request.query.line ? request.query.line : '' },
          { uniq: request.query.uniq ? request.query.uniq : '' },
          { eg: request.query.eg ? request.query.eg : '' },
          {
            working: '2025-04-13',
          },
        ],
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

  @Get('excel')
  async exportExcel(@Res() res: Response, @Request() request) {
    const returnData = await this.getData(request, true);
    await this._service.exportDataToExcel(returnData.data, res);
  }
}
