import { Module } from '@nestjs/common';
import { GroupMemberService } from './groupMember.service';
import { GroupMemberController } from './groupMember.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMember, GroupMemberSchemaFactory } from './entities/groupMember.entity';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { Group, GroupSchema } from '../group/entities/group.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    UserModule,
    GroupModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    MongooseModule.forFeatureAsync([{
      name: GroupMember.name,
      useFactory: GroupMemberSchemaFactory,
      imports: [MongooseModule.forFeature([])],
    }]),
  ],
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
