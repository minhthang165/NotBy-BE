import { forwardRef, Module } from '@nestjs/common'; // <-- Thêm forwardRef
import { BabiesService } from './babies.service';
import { BabiesController } from './babies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Baby, BabySchemaFactory } from './entities/baby.entity';
import { UserModule } from '../user/user.module'; // Giả sử bạn cần import UserModule ở đây

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Baby.name,
        schema: BabySchemaFactory(),
      },
    ]),
    forwardRef(() => UserModule), // <-- Dùng forwardRef ở đây
  ],
  controllers: [BabiesController],
  providers: [BabiesService],
  exports: [BabiesService, MongooseModule],
})
export class BabiesModule {}