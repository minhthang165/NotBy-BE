
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';


import { UserModule } from '../user/user.module';
import { BabiesModule } from '../babies/babies.module';
import { ArticleModule } from '../article/article.module';
import { DiaryEntriesModule } from '../diary-entries/diary-entries.module';
import { EventModule } from '../event/event.module';


@Module({
  imports: [
    UserModule,
    BabiesModule,
    ArticleModule,
    DiaryEntriesModule,
    EventModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}