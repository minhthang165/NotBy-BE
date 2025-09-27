
export class CreateDashboardDto {
  userCount: number;

  babyAgeDistribution: {
    under1Year: number;
    from1To3Years: number;
    from3To5Years: number;
    over5Years: number;
  };
  

  activityStats: {
    totalDiaries: number;
    totalEvents: number;

  };


  articleStats: {
    totalLikes: number;
    totalViews: number;
  };
}