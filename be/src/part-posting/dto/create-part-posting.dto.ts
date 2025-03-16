import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreatePartPostingDto {
  @IsNotEmpty()
  @IsInt()
  uniq: number;

  @IsNotEmpty()
  @IsPositive()
  qty: number;
}
