import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MediaFilesModule } from './modules/mediafiles/mediafiles.module';
import { ForumPostModule } from './modules/forumpost/forumpost.module';
import { ForumCommentModule } from './modules/forumcomment/forumcomment.module';
import { GroupMemberModule } from './modules/groupMember/groupMember.module';
import { GroupModule } from './modules/group/group.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    CategoryModule,
    AuthModule,
    UserModule,
    ArticleModule,
    CloudinaryModule,
    MediaFilesModule,
    ForumPostModule,
    ForumCommentModule,
    GroupModule,
    GroupMemberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
    // ,
    // {
    //   provide: 'APP_GUAFRD',
    //   useClass: RolesGuard,
    // }
  ],
})
export class AppModule {}
