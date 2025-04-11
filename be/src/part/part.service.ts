import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from './entities/part.entity';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { StatusEnum } from '../common/status.enum';

@Injectable()
export class PartService extends AbstractService {
  constructor(
    @InjectRepository(Part)
    private readonly _repository: Repository<Part>,
  ) {
    super(_repository);
  }

  async processExcel(
    file: Express.Multer.File,
  ): Promise<{ insertedCount: number; error?: string }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);

    const worksheet = workbook.worksheets[0]; // Ambil sheet pertama
    const parts: Part[] = [];
    const errors: string[] = [];

    // const status = StatusEnum[row.getCell(4).text as keyof typeof StatusEnum];

    for (const row of worksheet.getRows(2, worksheet.rowCount - 1) || []) {
      // Mulai dari baris ke-2 (lewati header)
      const part_no = row.getCell(1).text;
      const part_name = row.getCell(2).text;
      const supplier = row.getCell(3).text;
      const status = StatusEnum[row.getCell(4).text as keyof typeof StatusEnum];

      // Cek apakah part_no sudah ada
      const existingPart = await this.repository.findOne({
        where: { part_no },
      });
      if (existingPart) {
        errors.push(`Part No ${part_no} sudah ada di database.`);
        continue; // Lewati insert untuk part yang duplikat
      }

      const part = new Part();
      part.part_no = part_no;
      part.part_name = part_name;
      part.supplier = supplier;
      part.status = status;
      parts.push(part);
    }

    if (parts.length > 0) {
      await this.repository.save(parts);
    }

    fs.unlinkSync(file.path); // Hapus file setelah diproses

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Upload failed!', errors });
    }
    console.log({ insertedCount: parts.length });

    return { insertedCount: parts.length };
  }
}
