import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMediaFilesDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'File Url' })
    fileUrl: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'File Name' })
    fileName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'File Type(Video, Document, Image)' })
    fileType: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Author Id' })
    Author: string;
}
