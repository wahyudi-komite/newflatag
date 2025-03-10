import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateLineDto {
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  alias: string;
}
