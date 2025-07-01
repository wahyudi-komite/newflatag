import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Brackets, Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { PaginatedResult } from '../common/paginated-result.interface';
import { EgOut } from './entities/eg_out.entity';

@Injectable()
export class EgOutService extends AbstractService {
  constructor(
    @InjectRepository(EgOut) private readonly _repository: Repository<EgOut>,
  ) {
    super(_repository);
  }

  async consumeResultProduction(
    query,
    isExport = false,
  ): Promise<PaginatedResult> {
    const take: number = isExport ? 100000 : (query.limit ?? 10);
    const page: number = query.page ? query.page : 1;
    // const line: string[] = query.line ? query.line : ['1', '2', '3', '4', '5'];
    const keyword: string = query.keyword ? query.keyword : '';
    const direction: string = query.direction ? query.direction : 'l.alias';
    const sortData = query.sort ? query.sort.toUpperCase() : 'ASC';
    const createStart: string = query.start;
    const createEnd: string = query.end;

    const lineArray = query.line
      ? query.line.split(',').map(Number)
      : ['1', '2', '3', '4', '5'];

    const startDate = moment(createStart);
    const endDate = moment(createEnd);

    const offset = (page - 1) * take;

    const columns = ['l.alias', 'a.name', 'eg.uniq'];
    const filterParams = [
      {
        uniq: query.uniq ? query.uniq : '',
        tabel: 'eg',
        operator: 'like',
      },
      {
        line_id: lineArray,
        tabel: 'eg',
        operator: 'like',
      },
    ];

    const myQuery = this._repository
      .createQueryBuilder('eg')
      .select('l.name', 'name')
      .addSelect('a.alias', 'alias')
      .addSelect('eg.uniq', 'uniq');

    let totalExpr = '(';
    const current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
      const dateStr = current.format('YYYY-MM-DD');
      myQuery
        .addSelect(
          `CAST(SUM(CASE WHEN eg.working = '${dateStr}' AND eg.shift = 'DAY' THEN 1 ELSE 0 END) AS UNSIGNED)`,
          `${dateStr}_day`,
        )
        .addSelect(
          `CAST(SUM(CASE WHEN eg.working = '${dateStr}' AND eg.shift = 'NIGHT' THEN 1 ELSE 0 END) AS UNSIGNED)`,
          `${dateStr}_night`,
        );

      // tambahkan ke total expr
      totalExpr += `
    SUM(CASE WHEN eg.working = '${dateStr}' AND eg.shift = 'DAY' THEN 1 ELSE 0 END) +
    SUM(CASE WHEN eg.working = '${dateStr}' AND eg.shift = 'NIGHT' THEN 1 ELSE 0 END) + `;

      current.add(1, 'day');
    }

    // hapus + terakhir, lalu tutup totalExpr-nya
    totalExpr = totalExpr.replace(/\+\s*$/, '') + ')';

    // tambahkan total ke query
    myQuery.addSelect(totalExpr, 'total');

    myQuery
      .innerJoin('line', 'l', 'eg.line_id=l.id')
      .innerJoin('area', 'a', 'eg.area_id=a.id')
      .orderBy(direction, sortData)
      .groupBy('eg.line_id')
      .addGroupBy('eg.area_id')
      .addGroupBy('eg.uniq')
      .andWhere(
        new Brackets((qb) => {
          columns.map((data) => {
            qb.orWhere(data + ' like :keyword', {
              keyword: `%${keyword}%`,
            });
          });
        }),
      );

    if (filterParams && Array.isArray(filterParams)) {
      filterParams.forEach((filterObject) => {
        const key = Object.keys(filterObject)[0];
        const value = filterObject[key];
        const tabel = filterObject.tabel ? filterObject.tabel : 'eg';
        const operator = filterObject.operator
          ? filterObject.operator.toUpperCase()
          : '=';

        if (value !== '' && key) {
          let whereClause: string;
          const params: any = { [key]: value };

          if (Array.isArray(value)) {
            whereClause = `${tabel}.${key} IN (:...${key})`;
            params[key] = value;
          } else if (operator === 'LIKE') {
            whereClause = `${tabel}.${key} LIKE :${key}`;
            params[key] = `%${value}%`;
          } else {
            whereClause = `${tabel}.${key} ${operator} :${key}`;
          }

          myQuery.andWhere(whereClause, params);
        }
      });
    }

    const pagedQuery = myQuery.clone().offset(offset).limit(take);
    const data = await pagedQuery.getRawMany();

    const cleanResult = data.map((item) => {
      const newItem = { ...item };
      for (const key in newItem) {
        if (key.endsWith('_day') || key.endsWith('_night')) {
          newItem[key] = Number(newItem[key]);
        }
      }
      return newItem;
    });

    const totalData = await myQuery.clone().getRawMany();
    const total = totalData.length;
    return {
      data: cleanResult,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
        pageSize: take,
      },
    };
  }
}
