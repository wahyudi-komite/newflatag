import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEmployeeKaoDto {
  @IsNotEmpty()
  @IsNumber()
  id: string;
}
