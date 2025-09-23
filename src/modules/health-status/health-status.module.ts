import { Module } from '@nestjs/common';
import { HealthStatusService } from './health-status.service';
import { HealthStatusController } from './health-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthStatus, HealthStatusSchema } from './entities/health-status.entity';
import { Baby, BabySchema } from '../babies/entities/baby.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: HealthStatus.name, schema: HealthStatusSchema }]),
    MongooseModule.forFeature([{ name: Baby.name, schema: BabySchema }])
  ],
  controllers: [HealthStatusController],
  providers: [HealthStatusService],
  exports: [HealthStatusService],
})
export class HealthStatusModule {}