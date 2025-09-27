import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMediaFilesDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    fileUrl: string;
}
