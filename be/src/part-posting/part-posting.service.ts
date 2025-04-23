import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePartPostingDto } from './dto/create-part-posting.dto';
import { UpdatePartPostingDto } from './dto/update-part-posting.dto';
import { AbstractService } from '../common/abstract.service';
import { PartPosting } from './entities/part-posting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

import { Part } from '../part/entities/part.entity';
import { Area } from '../admin/area/entities/area.entity';
import { PaginatedResult } from '../common/paginated-result.interface';
import * as moment from 'moment';
import { log } from 'console';

@Injectable()
export class PartPostingService extends AbstractService {
  constructor(
    @InjectRepository(PartPosting)
    private readonly _repository: Repository<PartPosting>,
    @InjectRepository(Part) private readonly partRepository: Repository<Part>,
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
  ) {
    super(_repository);
  }

  async processExcel(
    file: Express.Multer.File,
  ): Promise<{ insertedCount: number; error?: string }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);

    const worksheet = workbook.worksheets[0]; // Ambil sheet pertama
    const datas: PartPosting[] = [];
    const errors: string[] = [];

    for (const row of worksheet.getRows(2, worksheet.rowCount - 1) || []) {
      // Mulai dari baris ke-2 (lewati header)
      const part_no = row.getCell(1).text;
      const area_id = Number(row.getCell(2).text);
      const uniq = Number(row.getCell(3).text);
      const qty = Number(row.getCell(4).text);

      const part = await this.partRepository.findOneBy({ part_no: part_no });
      const area = await this.areaRepository.findOneBy({ id: area_id });

      // Cek apakah part_no sudah ada
      // const existingPart = await this.repository.findOne({
      //   where: { part_no },
      // });
      // if (existingPart) {
      //   errors.push(`Part No ${part_no} sudah ada di database.`);
      //   continue; // Lewati insert untuk part yang duplikat
      // }

      const data = new PartPosting();
      data.part = part;
      data.area = area;
      data.uniq = uniq;
      data.qty = qty;
      datas.push(data);
    }

    if (datas.length > 0) {
      await this.repository.save(datas);
    }

    fs.unlinkSync(file.path); // Hapus file setelah diproses

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Upload failed!', errors });
    }
    return { insertedCount: datas.length };
  }

  async consumeData(query, isExport = false): Promise<PaginatedResult> {
    // const take: number = query.limit ? query.limit : 10;
    const take: number = isExport ? 100000 : (query.limit ?? 10);
    const page: number = query.page ? query.page : 1;
    const keyword: string = query.keyword ? query.keyword : '';
    const direction: string = query.direction ? query.direction : 'p.part_name';
    const sortData = query.sort ? query.sort.toUpperCase() : 'DESC';
    const createStart: string = query.start;
    const createEnd: string = query.end;

    const startDate = moment(createStart);
    const endDate = moment(createEnd);

    const offset = (page - 1) * take;

    const columns = ['part_no', 'part_name', 'supplier'];

    const filterParams = [
      {
        part_no: query.part_no ? query.part_no : '',
        tabel: 'p',
        operator: 'like',
      },
      {
        part_name: query.part_name ? query.part_name : '',
        tabel: 'p',
        operator: 'like',
      },
      {
        supplier: query.supplier ? query.supplier : '',
        tabel: 'p',
        operator: 'like',
      },
    ];

    const myQuery = this._repository
      .createQueryBuilder('pp')
      .select('pp.part_id', 'part_id')
      .addSelect('p.part_no', 'part_no')
      .addSelect('p.part_name', 'part_name')
      .addSelect('p.supplier', 'supplier');
    // Loop tanggal dan shift secara dinamis
    const current = startDate.clone();
    while (current.isSameOrBefore(endDate)) {
      const dateStr = current.format('YYYY-MM-DD');
      myQuery
        .addSelect(
          `CAST(SUM(CASE WHEN d.working = '${dateStr}' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END) AS UNSIGNED)`,
          `${dateStr}_day`,
        )
        .addSelect(
          `CAST(SUM(CASE WHEN d.working = '${dateStr}' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END) AS UNSIGNED)`,
          `${dateStr}_night`,
        );
      current.add(1, 'day');
    }

    myQuery
      .innerJoin('part', 'p', 'pp.part_id = p.id')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('area_id')
            .addSelect('working')
            .addSelect('shift')
            .addSelect('uniq_area')
            .addSelect('uniq')
            .addSelect('COUNT(*)', 'jumlah_uniq')
            .from('eg_out', 'eo')
            .where(
              "eo.working BETWEEN '" +
                createStart +
                "' AND '" +
                createEnd +
                "'",
            )
            .groupBy('area_id, working, shift, uniq_area, uniq');
        },
        'd',
        'pp.uniq_area = d.uniq_area AND pp.area_id = d.area_id AND pp.uniq = d.uniq',
      )

      // .where('pp.part_id = :id', { id: 332 })
      .andWhere(
        new Brackets((qb) => {
          columns.map((data) => {
            qb.orWhere(data + ' like :keyword', {
              keyword: `%${keyword}%`,
            });
          });
        }),
      )
      .orderBy(direction, sortData)
      .groupBy('pp.part_id')
      .addGroupBy('p.part_no')
      .addGroupBy('p.part_name')
      .addGroupBy('p.supplier');

    if (filterParams && Array.isArray(filterParams)) {
      filterParams.forEach((filterObject) => {
        const key = Object.keys(filterObject)[0];
        const value = filterObject[key];
        const tabel = filterObject.tabel ? filterObject.tabel : 'p';
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
    // log('query', myQuery.getSql());
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
