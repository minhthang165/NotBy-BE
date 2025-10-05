import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';

export class CreateForumpostDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Title' })
    Title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Content' })
    Content: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'File Id', required: false, nullable: true })
    FileId?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Author ID' })
    Author: string;

    @IsNumber()
    @ApiProperty({ description: 'Number of likes' })
    Likes: number;

    @IsNumber()
    @ApiProperty({ description: 'Number of views' })
    Views: number;
}
