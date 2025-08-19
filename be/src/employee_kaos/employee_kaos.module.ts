import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeKaosController } from './employee_kaos.controller';
import { EmployeeKaosService } from './employee_kaos.service';
import { EmployeeKao } from './entities/employee_kao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeKao])], // Add your entity here if needed
  controllers: [EmployeeKaosController],
  providers: [EmployeeKaosService],
  exports: [EmployeeKaosService], // Export the service if needed in other modules
})
export class EmployeeKaosModule {}
