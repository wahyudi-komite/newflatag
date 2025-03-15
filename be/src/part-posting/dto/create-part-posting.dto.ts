import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreatePartPostingDto {
  @IsNotEmpty()
  @IsInt()
  part_id: number;

  @IsNotEmpty()
  @IsInt()
  machine_id: number;

  @IsNotEmpty()
  @IsInt()
  uniq: number;

  @IsNotEmpty()
  @IsPositive()
  qty: number;
}
