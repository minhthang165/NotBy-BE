import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn, IsUUID } from 'class-validator';
import { CheckpointType } from '../entities/health-status.entity';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHealthStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  childId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty( { enum: CheckpointType, example: CheckpointType.HOME })
  @IsNotEmpty()
  @IsString()
  @IsIn([
    CheckpointType.HOME,
    CheckpointType.HOSPITAL,
    CheckpointType.CLINIC,
    CheckpointType.OTHER,
  ])
  checkedAt: CheckpointType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  imageId?: Types.ObjectId;
  // Chưa có image service nên tạm để thế này đã
}