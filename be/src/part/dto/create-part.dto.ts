import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartDto {
  @IsNotEmpty()
  @IsString()
  part_no: string;

  @IsNotEmpty()
  @IsString()
  part_name: string;

  @IsNotEmpty()
  @IsString()
  supplier: string;
}
