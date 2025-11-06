import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, Matches, IsOptional, IsMongoId } from 'class-validator';
import { ActivityType, DayOfWeek } from '../entities/timeable.entity';

export class CreateTimetableDto {

@ApiProperty({ description: 'ID của bé' })
  @IsMongoId()
  @IsNotEmpty()
  childId: string;

  @ApiProperty({ example: 'Học bơi' })
  @IsString()
  @IsNotEmpty()
  activityName: string;

  
  @ApiProperty({example: 'Thể thao' })
  @IsNotEmpty()
  @IsEnum(ActivityType)
  activityType: ActivityType;


  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.SATURDAY })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '09:00', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format' })
  startTime: string;

  @ApiProperty({ example: '10:30', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format' })
  endTime: string;

  @ApiProperty({ required: false, example: 'Cung văn hóa thiếu nhi' })
  @IsString()
  @IsOptional()
  location?: string;
  
  @ApiProperty({ required: false, example: 'Cô Lan' })
  @IsString()
  @IsOptional()
  teacher?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}