import { Module } from '@nestjs/common';
import { HealthStatusService } from './health-status.service';
import { HealthStatusController } from './health-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthStatus, HealthStatusSchema } from './entities/health-status.entity';
import { Baby, BabySchema } from '../babies/entities/baby.entity';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: HealthStatus.name, schema: HealthStatusSchema }]),
    MongooseModule.forFeature([{ name: Baby.name, schema: BabySchema }]),
    CloudinaryModule
  ],

  controllers: [HealthStatusController],
  providers: [HealthStatusService],
  exports: [HealthStatusService],
})
export class HealthStatusModule {}