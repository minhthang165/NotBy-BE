import { Module } from '@nestjs/common';
import { MediaFilesService } from './mediafiles.service';
import { MediaFilesController } from './mediafiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaFiles, MediaFilesSchemaFactory } from './entities/mediafile.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{ 
      name: MediaFiles.name,
      useFactory: MediaFilesSchemaFactory,
        inject: [],
        imports: [MongooseModule.forFeature([])],
      }
    ])
  ],
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
  exports: [MediaFilesService],
})
export class MediaFilesModule {}
