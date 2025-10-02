import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Category ID' })
    CategoryId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Title' })
    Title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Content' })
    Content: string;

    @IsString()
    @ApiProperty({ description: 'File Id', required: false })
    FileId: string;

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

    @IsNotEmpty()
    @IsString({ each: true })
    @ApiProperty({ description: 'Tags', type: [String] })
    Tags : string[];

    @IsNumber()
    @ApiProperty({ description: 'Estimated read time in minutes' })
    ReadTime: number;
    
    @IsString()
    @ApiProperty({ description: 'Description', required: false })
    Description: string;
}
