import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { BabiesModule } from './modules/babies/babies.module';
import { DiaryEntriesModule } from './modules/diary-entries/diary-entries.module';
import { HealthStatusModule } from './modules/health-status/health-status.module';
import { MedicalRecordsModule } from './modules/medical-record/medical-record.module';
import { EventModule } from './modules/event/event.module';

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
    AuthModule,
    UserModule,
    BabiesModule,
    DiaryEntriesModule,
    HealthStatusModule,
    MedicalRecordsModule,
    EventModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
