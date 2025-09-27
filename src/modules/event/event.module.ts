import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Baby, BabySchema } from '../babies/entities/baby.entity';
import { Event, EventSchema } from './entities/event.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Baby.name, schema: BabySchema },
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService, MongooseModule],
})
export class EventModule {}

