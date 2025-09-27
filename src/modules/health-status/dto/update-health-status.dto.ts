import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthStatusDto } from './create-health-status.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsIn } from 'class-validator';
import { CheckpointType } from '../entities/health-status.entity';

export class UpdateHealthStatusDto extends PartialType(CreateHealthStatusDto) {

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
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

  @ApiProperty()
  @IsString()
  description?: string;
  
 @ApiProperty({ type: 'string', format: 'binary', required: false })
       image?: any;   
}