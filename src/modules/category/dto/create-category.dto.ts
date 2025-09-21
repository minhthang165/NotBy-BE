import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    Title: string;
}
