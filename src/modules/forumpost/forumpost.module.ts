import { Module } from '@nestjs/common';
import { ForumPostService } from './forumpost.service';
import { ForumPostController } from './forumpost.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumPost, ForumPostSchemaFactory } from './entities/forumpost.entity';
import { MediaFilesModule } from '../mediafiles/mediafiles.module';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { MediaFiles, MediaFilesSchema } from '../mediafiles/entities/mediafile.entity';

@Module({
  imports: [
    UserModule,
    MediaFilesModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MediaFiles.name, schema: MediaFilesSchema }
    ]),
    MongooseModule.forFeatureAsync([{
      name: ForumPost.name,
      useFactory: ForumPostSchemaFactory,
      imports: [MongooseModule.forFeature([])],
    }]),
  ],
  controllers: [ForumPostController],
  providers: [ForumPostService],
  exports: [ForumPostService],
})
export class ForumPostModule {}
