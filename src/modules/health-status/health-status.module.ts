import { Module } from '@nestjs/common';
import { HealthStatusService } from './health-status.service';
import { HealthStatusController } from './health-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthStatus, HealthStatusSchema } from './entities/health-status.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HealthStatus.name, schema: HealthStatusSchema }]),
  ],
  controllers: [HealthStatusController],
  providers: [HealthStatusService],
  exports: [HealthStatusService],
})
export class HealthStatusModule {}