import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/typeorm.service';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LineModule } from './admin/line/line.module';
import { AreaModule } from './admin/area/area.module';
import { MachineModule } from './admin/machine/machine.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './permissions/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: undefined,
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    LineModule,
    AreaModule,
    MachineModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
