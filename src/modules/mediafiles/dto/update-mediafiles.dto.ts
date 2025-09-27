import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaFilesDto } from './create-mediafiles.dto';

export class UpdateMediaFilesDto extends PartialType(CreateMediaFilesDto) {}
