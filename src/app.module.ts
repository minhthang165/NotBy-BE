import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MediaFilesModule } from './modules/mediafiles/mediafiles.module';
import { BabiesModule } from './modules/babies/babies.module';
import { DiaryEntriesModule } from './modules/diary-entries/diary-entries.module';
import { HealthStatusModule } from './modules/health-status/health-status.module';
import { MedicalRecordsModule } from './modules/medical-record/medical-record.module';
import { EventModule } from './modules/event/event.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';


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
    BabiesModule,
    DiaryEntriesModule,
    HealthStatusModule,
    MedicalRecordsModule,
    EventModule,
    ArticleModule,
    CloudinaryModule,
    MediaFilesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: RolesGuard,
    // }
  ],
})
export class AppModule {}