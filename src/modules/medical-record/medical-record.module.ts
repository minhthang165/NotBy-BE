import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordsService } from './medical-record.service';
import { MedicalRecordsController } from './medical-record.controller';
import { MedicalRecord, MedicalRecordSchema } from './entities/medical-record.entity';
import { Baby, BabySchema } from '../babies/entities/baby.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema }
      , { name: Baby.name, schema: BabySchema }
    ])
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}