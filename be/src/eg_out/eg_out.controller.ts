import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { formatDate } from '../common/utils/date.utils';
import { HasPermission } from '../permissions/has-permission.decorator';
import { EgOutService } from './eg_out.service';

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
          {
            eg: request.query.eg ? request.query.eg : '',
            tabel: tabel,
            operator: 'like',
          },
          { shift: request.query.shift ? request.query.shift : '' },
          { line: request.query.line ? request.query.line : '' },
          { uniq: request.query.uniq ? request.query.uniq : '' },
          { working: request.query.working ? request.query.working : '' },
        ],
        column: allColumns,
      },
    );

    returnData.data = returnData.data.map(
      ({ create, working, shift, mc, uniq, line, area, eg }) => {
        return {
          create: formatDate(new Date(create)),
          working,
          shift,
          line: line?.name,
          area_alias: area?.alias,
          area_name: area?.name,
          mc,
          uniq,
          eg,
        };
      },
    );

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

  @Get('consume-result-production')
  async consumeData(@Request() request) {
    return await this._service.consumeResultProduction(request.query);
  }
}
