import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '../entities/medical-record.entity';
import { Types } from 'mongoose';  
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicalRecordDto {
@ApiProperty({ description: 'ID của bé', example: '64f0c7e2b4d1c2a1b2c3d4e5' })
  @IsNotEmpty()
  @IsMongoId() 
  childId: string;

  @ApiProperty({ enum: RecordType, example: RecordType.VACCINATION })
  @IsEnum(RecordType)
  recordType: RecordType;

  @ApiProperty({ description: 'Tên bệnh hoặc loại vắc-xin', example: 'Tiêm vắc-xin 6 trong 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Ngày ghi nhận',
    example: '2025-09-21T10:00:00.000Z',
  })
  @IsDateString() 
  recordDate: string; 

  @ApiProperty({
    required: false, 
    description: 'Nơi khám/tiêm',
    example: 'Bệnh viện Vinmec Đà Nẵng',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false, 
    description: 'Ghi chú thêm',
    example: 'Bé không bị sốt sau khi tiêm.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}