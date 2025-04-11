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
    console.log({ insertedCount: datas.length });

    return { insertedCount: datas.length };
  }
}
