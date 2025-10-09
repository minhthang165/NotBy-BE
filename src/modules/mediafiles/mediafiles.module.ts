import { Module } from '@nestjs/common';
import { MediaFilesService } from './mediafiles.service';
import { MediaFilesController } from './mediafiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaFiles, MediaFilesSchemaFactory } from './entities/mediafile.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeatureAsync([{ 
      name: MediaFiles.name,
      useFactory: MediaFilesSchemaFactory,
        imports: [MongooseModule.forFeature([])],
      }
    ])
  ],
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
  exports: [MediaFilesService],
})
export class MediaFilesModule {}
