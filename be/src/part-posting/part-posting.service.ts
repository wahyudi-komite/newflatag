import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePartPostingDto } from './dto/create-part-posting.dto';
import { UpdatePartPostingDto } from './dto/update-part-posting.dto';
import { AbstractService } from '../common/abstract.service';
import { PartPosting } from './entities/part-posting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

import { Part } from '../part/entities/part.entity';
import { Area } from '../admin/area/entities/area.entity';

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

  async consumeData(): Promise<any> {
    return await this._repository
      .createQueryBuilder('pp')
      .select('pp.part_id', 'part_id')
      .addSelect('pp.uniq_area', 'uniq_area')
      .addSelect('p.part_no', 'part_no')
      .addSelect('p.part_name', 'part_name')
      .addSelect('p.supplier', 'supplier')

      // Loop tanggal dan shift
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-01' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-01_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-01' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-01_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-02' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-02_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-02' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-02_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-03' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-03_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-03' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-03_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-04' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-04_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-04' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-04_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-05' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-05_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-05' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-05_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-06' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-06_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-06' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-06_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-07' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-07_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-07' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-07_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-08' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-08_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-08' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-08_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-09' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-09_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-09' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-09_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-10' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-10_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-10' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-10_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-11' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-11_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-11' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-11_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-12' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-12_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-12' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-12_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-13' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-13_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-13' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-13_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-14' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-14_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-14' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-14_night',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-15' AND d.shift = 'DAY' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-15_day',
      )
      .addSelect(
        `SUM(CASE WHEN d.working = '2025-04-15' AND d.shift = 'NIGHT' THEN pp.qty * d.jumlah_uniq ELSE 0 END)`,
        '2025-04-15_night',
      )

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
            .where("eo.working BETWEEN '2025-04-01' AND '2025-04-15'")
            .groupBy('area_id, working, shift, uniq_area, uniq');
        },
        'd',
        'pp.uniq_area = d.uniq_area AND pp.area_id = d.area_id AND pp.uniq = d.uniq',
      )

      // .where('pp.part_id = :id', { id: 390 }) // optional filter
      .groupBy('pp.part_id')
      .addGroupBy('pp.uniq_area')
      .addGroupBy('p.part_no')
      .addGroupBy('p.part_name')
      .addGroupBy('p.supplier')
      .getRawMany();
  }
}
