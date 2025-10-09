import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-groupMember.dto';
import { UpdateGroupMemberDto } from './dto/update-groupMember.dto';
import { GroupMember, GroupMemberDocument } from './entities/groupMember.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../group/entities/group.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectModel(GroupMember.name) private readonly groupMemberModel: Model<GroupMember>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(CreateGroupMemberDto: CreateGroupMemberDto): Promise<GroupMember> {
    const { GroupId, UserId } = CreateGroupMemberDto;

    const group = await this.groupModel.findById(GroupId);
    if (!group) {
      throw new NotFoundException(`Group with id ${GroupId} not found`);
    }

    const user = await this.userModel.findById(UserId);
    if (!user) {
      throw new NotFoundException(`User with id ${UserId} not found`);
    }

    const newGroupMember = new this.groupMemberModel({
      Group: group,
      User: user,
    });

    return newGroupMember.save();
  }

  async findByCompositeKey(userId: string, groupId: string): Promise<GroupMemberDocument | null> {
    const groupMember = await this.groupMemberModel
      .findOne({
        User: userId,
        Group: groupId
      })
      .populate('Group')
      .populate('User')
      .exec();
      
    if (!groupMember) {
      throw new NotFoundException(`Group member not found for user ${userId} in group ${groupId}`);
    }
  
    return groupMember;
  }

  async findById(id: string): Promise<GroupMemberDocument | null> {
    const groupMember = await this.groupMemberModel
      .findById(id)
      .populate('Group')
      .populate('User')
      .exec();
      
    if (!groupMember) {
      throw new NotFoundException(`Group member with id ${id} not found`);
    }
    
    return groupMember;
  }

  async findByUserId(userId: string): Promise<GroupMemberDocument[]> {
    return this.groupMemberModel
      .find({ User: userId })
      .populate('Group')
      .populate('User')
      .exec();
  }

  async findByGroupId(groupId: string): Promise<GroupMemberDocument[]> {
    return this.groupMemberModel
      .find({ Group: groupId })
      .populate('Group')
      .populate('User')
      .exec();
  }

  async update(id: string, UpdateGroupMemberDto: UpdateGroupMemberDto): Promise<GroupMemberDocument | null> {
    const groupMember = await this.groupMemberModel.findById(id);
    if (!groupMember) {
      throw new NotFoundException(`GroupMember with id ${id} not found`);
    }

    if (UpdateGroupMemberDto.GroupId) {
      const group = await this.groupModel.findById(UpdateGroupMemberDto.GroupId);
      if (!group) {
        throw new NotFoundException(`Group with id ${UpdateGroupMemberDto.GroupId} not found`);
      }
      groupMember.Group = group;
    }

    if (UpdateGroupMemberDto.UserId) {
      const user = await this.userModel.findById(UpdateGroupMemberDto.UserId);
      if (!user) {
        throw new NotFoundException(`User with id ${UpdateGroupMemberDto.UserId} not found`);
      }
      groupMember.User = user;
    }
    return groupMember.save();
  }

  async findAll(): Promise<GroupMemberDocument[]> {
    return this.groupMemberModel
      .find()
      .populate('Group')
      .populate('User')
      .exec();
  }

  async delete(id: string): Promise<GroupMemberDocument | null> {
    return this.groupMemberModel.findByIdAndDelete(id).exec();
  }
}
