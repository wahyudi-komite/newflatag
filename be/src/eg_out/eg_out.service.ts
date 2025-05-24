import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
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
    const line: number = query.line ? query.line : 5;
    const keyword: string = query.keyword ? query.keyword : '';
    const direction: string = query.direction ? query.direction : 'p.part_name';
    const sortData = query.sort ? query.sort.toUpperCase() : 'DESC';
    const createStart: string = query.start;
    const createEnd: string = query.end;

    const startDate = moment(createStart);
    const endDate = moment(createEnd);

    const offset = (page - 1) * take;

    const columns = [];

    const myQuery = this._repository.createQueryBuilder('eg_out');

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
