import { Module } from '@nestjs/common';
import { DiaryEntriesService } from './diary-entries.service';
import { DiaryEntriesController } from './diary-entries.controller';
import { DiaryEntry, DiaryEntrySchema } from './entities/diary-entry.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiaryEntry.name, schema: DiaryEntrySchema }
    ])
  ],
  controllers: [DiaryEntriesController],
  providers: [DiaryEntriesService],
  exports: [DiaryEntriesService],
})
export class DiaryEntriesModule {}