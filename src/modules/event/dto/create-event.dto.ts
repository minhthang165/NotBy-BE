import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventType } from '../entities/event.entity';
import { Types } from 'mongoose';

export class CreateEventDto {
  @ApiProperty()
  @IsMongoId() 
  @IsNotEmpty()
  childId: string; 

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDateString() 
  startAt: string; 

  @ApiProperty()
  @IsDateString() 
  endAt: string; 

  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}