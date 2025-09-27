import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaryEntryDto } from './create-diary-entry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { DiaryType, DiaryCategory } from '../entities/diary-entry.entity';

export class UpdateDiaryEntryDto extends PartialType(CreateDiaryEntryDto) {
     @ApiProperty()
      @IsString()
      title: string;
    
      @ApiProperty()
      @IsString()
      content: string;
    
      @ApiProperty({ enum: DiaryType, example: DiaryType.DIARY })
      @IsEnum(DiaryType)
      diaryType: DiaryType;
    
      @ApiProperty({ enum: DiaryCategory, example: DiaryCategory.VAN_DONG })
      @IsEnum(DiaryCategory)
      category: DiaryCategory;
    
      @ApiProperty({ type: 'string', format: 'binary', required: false })
      image?: any;
}
