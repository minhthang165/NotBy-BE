import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimetableService } from './timeable.service';
import { TimetableController } from './timeable.controller';
import { Timetable, TimetableSchema } from './entities/timeable.entity';
import { BabiesModule } from '../babies/babies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Timetable.name, schema: TimetableSchema }]),
    BabiesModule,
  ],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService, MongooseModule],
})
export class TimetableModule {}