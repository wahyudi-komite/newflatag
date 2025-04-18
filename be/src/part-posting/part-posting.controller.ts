import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  ClassSerializerInterceptor,
  Res,
  NotFoundException,
  Request,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { PartPostingService } from './part-posting.service';
import { CreatePartPostingDto } from './dto/create-part-posting.dto';
import { UpdatePartPostingDto } from './dto/update-part-posting.dto';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const tabel = 'part_posting';
const columns = ['id', 'uniq', 'qty'].map((col) => `${tabel}.${col}`);
const lineColumns = ['name'].map((col) => `line.${col}`);
const areaColumns = ['name'].map((col) => `area.${col}`);
const partColumns = ['part_no', 'part_name'].map((col) => `part.${col}`);

const allColumns = [...columns, ...partColumns, ...lineColumns, ...areaColumns];

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@HasPermission('part_posting')
@Controller('part-posting')
export class PartPostingController {
  constructor(private readonly _service: PartPostingService) {}

  private async getData(request, isExport = false): Promise<any> {
    const returnData = await this._service.paginate(
      tabel,
      [
        [tabel + '.part', 'part'],
        [tabel + '.area', 'area'],
        ['area.line', 'line'],
      ],
      {
        limit: isExport ? 1000000 : request.query.limit,
        page: request.query.page,
        sort: request.query.sort,
        direction: request.query.direction,
        keyword: request.query.keyword,
        column: allColumns,
        filterParams: [
          {
            part_no: request.query.part_no ? request.query.part_no : '',
            tabel: 'part',
          },
          {
            part_name: request.query.part_name ? request.query.part_name : '',
            tabel: 'part',
            operator: 'like',
          },
          { uniq: request.query.uniq ? request.query.uniq : '' },

          {
            line: request.query.line ? request.query.line : '',
            tabel: 'area',
          },
        ],
      },
    );

    returnData.data = returnData.data.map((item) => ({
      ...item,
      // create: formatDate(new Date(item.create)),
      // timejob: formatDate(new Date(item.timejob)),
    }));

    return returnData;
  }

  @Post()
  async create(@Body() createDto: CreatePartPostingDto) {
    // const existingName = await this._service.findOne({
    //   machine_no: createDto.machine_no,
    // });
    // if (existingName) {
    //   throw new ConflictException(
    //     `No "${createDto.machine_no}" already exists.`,
    //   );
    // }

    // const existingAlias = await this._service.findOne({
    //   machine_name: createDto.machine_name,
    // });
    // if (existingAlias) {
    //   throw new ConflictException(
    //     `Alias "${createDto.machine_name}" already exists.`,
    //   );
    // }

    // createDto.machine_name = capitalize(createDto.machine_name);
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
          const fileExt = path.extname(file.originalname);
          callback(null, `upload-${Date.now()}${fileExt}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return callback(
            new BadRequestException('Only Excel files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const insertedCount = await this._service.processExcel(file);
      return { message: 'Upload successful!', insertedCount };
    } catch (error) {
      return { message: 'Upload failed!', error: error.message };
    }
  }

  @Get()
  async findAll(@Request() request) {
    return this.getData(request);
  }

  @Get('files/download-template')
  downloadTemplate(@Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '../../public/templates/part-posting/format_upload.xlsx',
    );
    res.download(filePath);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePartPostingDto,
  ) {
    const cekId = await this._service.findOne({ id: +id });
    if (!cekId) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }

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

  @Get('consume')
  async consumeData() {
    return await this._service.consumeData();
  }
}
