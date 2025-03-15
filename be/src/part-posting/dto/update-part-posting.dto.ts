import { PartialType } from '@nestjs/mapped-types';
import { CreatePartPostingDto } from './create-part-posting.dto';

export class UpdatePartPostingDto extends PartialType(CreatePartPostingDto) {}
