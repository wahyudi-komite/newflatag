import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Brackets, Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';
import { applyPrimeNgFilters } from './utils/applyPrimeNgFilters';

@Injectable()
export class AbstractService {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations: any[] = [], query): Promise<any[]> {
    const order: any = {
      [query.direction ? query.direction : 'id']: query.sort
        ? query.sort.toUpperCase()
        : 'DESC',
    };

    const where: any = query.field ? { [query.field]: query.keyword } : {};

    return this.repository.find({
      where: where,
      order: order,
      relations: relations,
    });
  }

  async paginate(tbl, relations, query): Promise<PaginatedResult> {
    const take: number = query.limit ? query.limit : 100000;
    const page: number = query.page ? query.page : 1;
    const keyword: string = query.keyword ? query.keyword : '';
    const direction: string = query.direction ? query.direction : tbl + '.id';
    const sortData = query.sort ? query.sort.toUpperCase() : 'DESC';

    const myQuery = this.repository
      .createQueryBuilder(tbl)
      .where(tbl + '.id >=:id', { id: 0 })
      .andWhere(
        new Brackets((qb) => {
          query.column.map((data) => {
            qb.orWhere(data + ' like :keyword', {
              keyword: `%${keyword}%`,
            });
          });
        }),
      )
      .orderBy(direction, sortData)
      .take(take)
      .skip((page - 1) * take);

    if (relations) {
      relations.map((relation) => {
        myQuery.leftJoinAndSelect(relation[0], relation[1]);
      });
    }

    // if (query.filterParams) {
    //   const objectArray = Object.entries(query.filterParams);
    //   objectArray.forEach(([key, value]) => {
    //     if (value != '') {
    //       if (key == 'problem_date') {
    //         const start = new Date(value + ' 00:00:00');
    //         const end = new Date(value + ' 23:59:59');
    //         myQuery
    //           .andWhere(tbl + '.problem_date >= :start', { start: start })
    //           .andWhere(tbl + '.problem_date <= :end', { end: end });
    //       } else {
    //         myQuery.andWhere(tbl + '.' + key + ' =:' + key, { [key]: value });
    //       }
    //     }
    //   });
    // }

    if (query.filterParams && Array.isArray(query.filterParams)) {
      query.filterParams.forEach((filterObject) => {
        const key = Object.keys(filterObject)[0]; // Ambil kunci filter (misalnya, part_no)
        const value = filterObject[key];
        const tabel = filterObject.tabel ? filterObject.tabel : tbl; // Ambil alias tabel jika ada
        const operator = filterObject.operator
          ? filterObject.operator.toUpperCase()
          : '=';

        if (value !== '' && key) {
          let whereClause: string;
          const params: any = { [key]: value };

          if (operator === 'LIKE') {
            whereClause = `${tabel}.${key} LIKE :${key}`;
            params[key] = `%${value}%`;
          } else {
            whereClause = `${tabel}.${key} ${operator} :${key}`;
          }

          myQuery.andWhere(whereClause, params);
        }
      });
    }

    const [data, total] = await myQuery.getManyAndCount();

    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
        pageSize: take,
      },
    };
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  async findOne(data: any, relations = []): Promise<any> {
    return this.repository.findOne({
      where: data,
      relations: relations,
    });
  }

  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }

  async remove(id: number): Promise<any> {
    return this.repository.delete(id);
  }

  async exportDataToExcel(data: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Export');

    // Header Columns
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key.toUpperCase(),
      key: key,
      width: 15,
    }));

    // Insert Data Rows
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Set Response Headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=data_export.xlsx',
    );

    // Write and Send Excel File
    await workbook.xlsx.write(res);
    res.end();
  }

  async paginateServerSide(tbl, relations, query): Promise<PaginatedResult> {
    const take =
      query.exportData === 'true'
        ? 100000
        : query.rows
          ? Number(query.rows)
          : 100000;
    const page = query.first ? Number(query.first) : 0;
    const keyword: string = query.globalFilter ? query.globalFilter : '';
    const direction: string = query.sortField ? query.sortField : 'id';
    const sortData = query.sortOrder === '1' ? 'ASC' : 'DESC';

    const myQuery = this.repository
      .createQueryBuilder(tbl)
      .where(tbl + '.id >=:id', { id: 0 })
      .andWhere(
        new Brackets((qb) => {
          query.columns.map((data) => {
            qb.orWhere(data + ' like :keyword', {
              keyword: `%${keyword}%`,
            });
          });
        }),
      )
      .orderBy(`${tbl}.${direction}`, sortData)
      .take(take)
      .skip(page);

    if (relations) {
      relations.map((relation) => {
        myQuery.leftJoinAndSelect(relation[0], relation[1]);
      });
    }

    applyPrimeNgFilters(myQuery, query.filters, tbl);

    const [data, total] = await myQuery.getManyAndCount();

    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
        pageSize: take,
      },
    };
  }

  async getCount(plant: string, where: any = {}): Promise<number> {
    return this.repository.count({
      where: {
        plant,
        ...where,
      },
    });
  }
}
