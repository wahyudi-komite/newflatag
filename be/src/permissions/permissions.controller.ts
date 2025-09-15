import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { HasPermission } from './has-permission.decorator';
import { PermissionsService } from './permissions.service';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@HasPermission('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    const normalizedDto = Object.fromEntries(
      Object.entries(createPermissionDto).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.toLowerCase() : value,
      ]),
    );

    return this.permissionsService.create(normalizedDto);
  }

  @Get('all')
  async all(@Request() request) {
    return this.permissionsService.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
    });
  }

  @Get()
  async findAll(@Request() request) {
    return this.permissionsService.paginate('permissions', [], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: ['name'],
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);

    return this.permissionsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const normalizedDto = Object.fromEntries(
      Object.entries(updatePermissionDto).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.toLowerCase() : value,
      ]),
    );

    return this.permissionsService.update(+id, normalizedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }

  @Post('findName')
  get(@Body('name') name: string) {
    return this.permissionsService.findOne({ name });
  }
}
