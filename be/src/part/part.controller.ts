import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
  ConflictException,
  Request,
  Res,
  NotFoundException,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { PartService } from './part.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { capitalize } from '../common/utils/string.util';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const tabel = 'part';
const columns = ['id', 'part_no', 'part_name', 'supplier', 'status'].map(
  (col) => `${tabel}.${col}`,
);
// const lineColumns = ['name'].map((col) => `line.${col}`);
// const areaColumns = ['name'].map((col) => `area.${col}`);

// const allColumns = [...columns, ...lineColumns, ...areaColumns];

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('part')
@Controller('part')
export class PartController {
  constructor(private readonly _service: PartService) {}

  private async getData(request, isExport = false): Promise<any> {
    const returnData = await this._service.paginate(tabel, [], {
      limit: isExport ? 1000000 : request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: columns,
    });

    returnData.data = returnData.data.map((item) => ({
      ...item,
      // create: formatDate(new Date(item.create)),
      // timejob: formatDate(new Date(item.timejob)),
    }));

    return returnData;
  }

  @Post()
  async create(@Body() createDto: CreatePartDto) {
    const existingName = await this._service.findOne({
      part_no: createDto.part_no,
    });
    if (existingName) {
      throw new ConflictException(
        `Name "${createDto.part_no}" already exists.`,
      );
    }
    createDto.part_name = capitalize(createDto.part_name);
    createDto.supplier = capitalize(createDto.supplier);
    return this._service.create(createDto);
  }

  @Post('findName')
  get(@Body() data: any) {
    return this._service.findOne(data);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExt = extname(file.originalname);
          callback(null, `upload-${Date.now()}${fileExt}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return callback(new Error('Only Excel files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const insertedCount = await this._service.processExcel(file);
    return { message: 'Upload successful!', insertedCount };
  }

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }

  @Get('all')
  async all(@Request() request) {
    return this._service.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
      field: request.query.field,
      keyword: request.query.keyword,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdatePartDto) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

    // Cek apakah `name` sudah ada dengan ID berbeda
    const duplicateName = await this._service.findOne({
      part_no: updateDto.part_no,
    });

    if (duplicateName && duplicateName.id !== +id) {
      throw new ConflictException(`"${updateDto.part_no}" already exists.`);
    }
    updateDto.part_name = capitalize(updateDto.part_name);
    updateDto.supplier = capitalize(updateDto.supplier);
    return this._service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._service.remove(+id);
  }

  @Get('excel')
  async exportExcel(@Res() res: Response, @Request() request) {
    const returnData = await this.getData(request, true);
    await this._service.exportDataToExcel(returnData.data, res);
  }
}
