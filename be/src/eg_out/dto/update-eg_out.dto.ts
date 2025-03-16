import { PartialType } from '@nestjs/mapped-types';
import { CreateEgOutDto } from './create-eg_out.dto';

export class UpdateEgOutDto extends PartialType(CreateEgOutDto) {}
