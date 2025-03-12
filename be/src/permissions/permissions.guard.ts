import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UsersService,
    private roleService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());

    if (!access) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const id = await this.authService.userId(request);

    if (!id) {
      return false; // User tidak terautentikasi.
    }

    const user: User = await this.userService.findOne({ id }, ['role']);

    if (!user || !user.role) {
      return false; // User atau role tidak ditemukan.
    }

    const role: Role = await this.roleService.findOne({ id: user.role.id }, [
      'permissions',
    ]);
    if (!role || !role.permissions) {
      return false; // Role tidak memiliki permission.
    }

    if (request.method === 'GET') {
      if (!role.permissions || role.permissions.length === 0) {
        return false; // Tidak ada izin, tolak akses
      }

      return role.permissions.some(
        (p) => p.name === `${access} read` || p.name === `${access} update`,
      );
    }
    return role.permissions.some((p) => p.name === `${access} update`);
  }
}
