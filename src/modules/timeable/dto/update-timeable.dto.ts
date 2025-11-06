import { PartialType } from '@nestjs/mapped-types';
import { CreateTimetableDto } from './create-timeable.dto';

export class UpdateTimeableDto extends PartialType(CreateTimetableDto) {}
