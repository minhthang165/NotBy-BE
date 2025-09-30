import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDashboardDto } from '../dashboard/dto/create-dashboard.dto';
import { User } from '../user/entities/user.entity';
import { Baby } from '../babies/entities/baby.entity';
import { Article } from '../article/entities/article.entity';
import { DiaryEntry } from '../diary-entries/entities/diary-entry.entity';
import { Event } from '../event/entities/event.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Baby.name) private readonly babyModel: Model<Baby>,
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(DiaryEntry.name)
    private readonly diaryEntryModel: Model<DiaryEntry>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async getStats(): Promise<CreateDashboardDto> {
    const today = new Date();
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25; 

    // --- LOGIC TÍNH TUỔI ---
    const babyAgeResult = await this.babyModel.aggregate([
      {
        $project: {
          age: {
            $divide: [{ $subtract: [today, '$dob'] }, msPerYear],
          },
        },
      },
      {
        $group: {
          _id: null,
          under1Year: {
            $sum: { $cond: [{ $lt: ['$age', 1] }, 1, 0] },
          },
          from1To3Years: {
            $sum: { $cond: [{ $and: [{ $gte: ['$age', 1] }, { $lt: ['$age', 3] }] }, 1, 0] },
          },
          from3To5Years: {
            $sum: { $cond: [{ $and: [{ $gte: ['$age', 3] }, { $lt: ['$age', 5] }] }, 1, 0] },
          },
          over5Years: {
            $sum: { $cond: [{ $gte: ['$age', 5] }, 1, 0] },
          },
        },
      },
    ]);

    const articleStatsResult = await this.articleModel.aggregate([
    {
      $group: {
        _id: null,
        totalLikes: { $sum: '$likes' },
        totalViews: { $sum: '$views' },
      },
    },
  ]);

    const babyAgeDistribution = babyAgeResult[0] || {
      under1Year: 0,
      from1To3Years: 0,
      from3To5Years: 0,
      over5Years: 0,
    };
    delete babyAgeDistribution._id; 


    
    const userCount = await this.userModel.countDocuments();
    const articleStats = articleStatsResult[0] || { totalLikes: 0, totalViews: 0 };
    const totalDiaries = await this.diaryEntryModel.countDocuments();
    const totalEvents = await this.eventModel.countDocuments();

    
    const response: CreateDashboardDto = {
      userCount,
      articleStats,
      babyAgeDistribution, 
      activityStats: {
        totalDiaries,
        totalEvents,
      },
    };

    return response;
  }
}