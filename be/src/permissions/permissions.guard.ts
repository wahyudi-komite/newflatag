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
    // Coba ambil metadata dari handler (method) terlebih dahulu
    let access = this.reflector.get<string[]>('access', context.getHandler());

    // Jika tidak ditemukan di handler, coba ambil dari class (controller)
    if (!access) {
      access = this.reflector.get<string[]>('access', context.getClass());
    }

    if (!access) {
      return true; // Tidak ada permission yang didefinisikan, izinkan akses
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

    // Karena access adalah array, kita perlu loop melalui array tersebut.
    const requiredPermissions = access
      .map((permission) => {
        if (request.method === 'GET') {
          return [`${permission} read`, `${permission} update`];
        }
        return [`${permission} update`];
      })
      .flat(); // flat() untuk menggabungkan array permissions

    return requiredPermissions.some((requiredPermission) =>
      role.permissions.some((p) => p.name === requiredPermission),
    );
  }
}
