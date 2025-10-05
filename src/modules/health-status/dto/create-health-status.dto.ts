import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { CheckpointType } from '../entities/health-status.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHealthStatusDto {
  @ApiProperty({ type: String })
  @IsString()
  childId: string;

@ApiProperty()
  @IsNumber()
  @Type(() => Number)
  height: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number) 
  weight: number;


  @ApiProperty({ enum: CheckpointType, example: CheckpointType.HOME })
  @IsString()
  @IsIn([
    CheckpointType.HOME,
    CheckpointType.HOSPITAL,
    CheckpointType.CLINIC,
    CheckpointType.OTHER,
  ])
  checkedAt: CheckpointType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()             
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}