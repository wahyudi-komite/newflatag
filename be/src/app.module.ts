import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LineModule } from './admin/line/line.module';
import { AreaModule } from './admin/area/area.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './permissions/permissions.guard';
import { PartModule } from './part/part.module';
import { PartPostingModule } from './part-posting/part-posting.module';
import { EgOutModule } from './eg_out/eg_out.module';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DATABASE_USERNAME || 'wahyudi',
      password: process.env.DATABASE_PASSWORD || 'Astra123',
      database: process.env.DATABASE_NAME || 'consumo_250225',
      autoLoadEntities: true,
      synchronize:
        process.env.DATABASE_SYNCHRONIZE == 'true' ? true : false || false,
      logging: process.env.DATABASE_DEBUG == 'true' ? true : false || false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 2000,
        },
      ],
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    LineModule,
    AreaModule,
    PartModule,
    PartPostingModule,
    EgOutModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
