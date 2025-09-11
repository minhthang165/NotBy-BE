import { Module } from '@nestjs/common';
import { BabiesService } from './babies.service';
import { BabiesController } from './babies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Baby, BabySchemaFactory } from './entities/baby.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: Baby.name,
      useFactory: BabySchemaFactory,
        inject: [],
        imports: [MongooseModule.forFeature([])],
      }
    ])
  ],
  controllers: [BabiesController],
  providers: [BabiesService],
  exports: [BabiesService],
})
export class BabiesModule {}
