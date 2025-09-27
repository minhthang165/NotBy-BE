import { Module } from '@nestjs/common';
import { ForumCommentService } from './forumcomment.service';
import { ForumCommentController } from './forumcomment.controller';
import { ForumComment, ForumCommentSchemaFactory } from './entity/forumcomment.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaFilesModule } from '../mediafiles/mediafiles.module';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { MediaFiles, MediaFilesSchema } from '../mediafiles/entities/mediafile.entity';
import { ForumPostModule } from '../forumpost/forumpost.module';
import { ForumPostSchema } from '../forumpost/entities/forumpost.entity';
import { ForumPost } from '../forumpost/entities/forumpost.entity';

@Module({
  imports: [
    UserModule,
    MediaFilesModule,
    ForumPostModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MediaFiles.name, schema: MediaFilesSchema },
      { name: ForumPost.name, schema: ForumPostSchema },
    ]),
    MongooseModule.forFeatureAsync([{
      name: ForumComment.name,
      useFactory: ForumCommentSchemaFactory,
      imports: [MongooseModule.forFeature([])],
    }]),
  ],
  controllers: [ForumCommentController],
  providers: [ForumCommentService],
  exports: [ForumCommentService],
})
export class ForumCommentModule {}
