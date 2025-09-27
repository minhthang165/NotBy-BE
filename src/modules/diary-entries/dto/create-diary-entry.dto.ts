import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiaryType, DiaryCategory } from '../entities/diary-entry.entity';

export class CreateDiaryEntryDto {
  @ApiProperty({ example: '60f7c2b8e1b1c8a1b8e1b1c8', description: 'ID của baby' })

  @IsMongoId()
  @IsNotEmpty()
  childId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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