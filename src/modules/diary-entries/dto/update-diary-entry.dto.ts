import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaryEntryDto } from './create-diary-entry.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiaryEntryDto extends PartialType(CreateDiaryEntryDto) {
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    image?: any;
}