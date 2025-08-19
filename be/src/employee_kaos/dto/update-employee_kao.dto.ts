import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeKaoDto } from './create-employee_kao.dto';

export class UpdateEmployeeKaoDto extends PartialType(CreateEmployeeKaoDto) {}
