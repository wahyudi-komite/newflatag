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
import { HasPermission } from 'src/permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { formatDate } from '../common/utils/date.utils';
import { RolesService } from './roles.service';

const tabel = 'roles';
const columns = ['id', 'name'].map((col) => `${tabel}.${col}`);

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  private async getDataServerSide(query): Promise<any> {
    const request = {
      ...query,
      columns,
    };
    const returnData = await this.rolesService.paginateServerSide(
      tabel,
      [['roles.permissions', 'permissions']],
      request,
    );

    returnData.data = returnData.data.map((item) => ({
      ...item,
      created_at: formatDate(new Date(item.created_at)),
      updated_at: formatDate(new Date(item.updated_at)),
    }));

    return returnData;
  }

  @Post()
  @HasPermission('roles')
  async create(@Body('name') name: string, @Body('permissions') ids: number[]) {
    return this.rolesService.create({
      name,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Post('findName')
  get(@Body('name') name: string) {
    return this.rolesService.findOne({ name });
  }

  @Get()
  // @HasPermission('roles')
  async findAll(@Request() request) {
    return this.getDataServerSide(request.query);
  }

  @Get('all')
  @HasPermission('roles')
  async all(@Request() request) {
    return this.rolesService.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
      limit: request.query.limit,
    });
  }

  @Get('roleAccess')
  async find(@Request() request) {
    return this.rolesService.findOne(
      { id: request.query.id, permissions: { name: request.query.name } },
      ['permissions'],
    );
  }

  @Get(':id')
  @HasPermission('roles')
  async findOne(@Param('id') id: number) {
    return this.rolesService.findOne(+id, ['permissions']);
  }

  @Put(':id')
  @HasPermission('roles')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ) {
    await this.rolesService.update(id, {
      name,
    });

    const role = await this.rolesService.findOne({ id });

    return this.rolesService.create({
      ...role,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Delete(':id')
  @HasPermission('roles')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
