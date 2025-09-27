import { forwardRef, Module } from '@nestjs/common'; // <-- Thêm forwardRef
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchemaFactory } from './entities/user.entity';
import { BabiesModule } from './../babies/babies.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchemaFactory(),
      },
    ]),
    forwardRef(() => BabiesModule), // <-- Dùng forwardRef ở đây
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}