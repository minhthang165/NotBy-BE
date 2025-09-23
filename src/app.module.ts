import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { Category } from './modules/category/entities/category.entity';
import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { Article } from './modules/article/entities/article.entity';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MediaFilesModule } from './modules/mediafiles/mediafiles.module';

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
