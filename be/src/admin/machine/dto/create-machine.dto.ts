import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateMachineDto {
  @IsNotEmpty()
  @IsNumber()
  machine_no: number;

  @IsNotEmpty()
  @MinLength(5)
  machine_name: string;
}
