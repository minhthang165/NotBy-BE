import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, GroupDocument } from './entities/group.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/entities/category.entity';
import { MediaFiles } from '../mediafiles/entities/mediafile.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(MediaFiles.name) private readonly mediaFilesModel: Model<MediaFiles>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const { CategoryId, GroupName, GroupDescription, AvatarId, MemberCount, PostCount } =
      createGroupDto;

    const category = await this.categoryModel.findById(CategoryId);
    if (!category) {
      throw new NotFoundException(`Category with id ${CategoryId} not found`);
    }

    let file = null;
    if (AvatarId) {
      file = await this.mediaFilesModel.findById(AvatarId);
    if (!file) {
      throw new NotFoundException(`Media file with id ${AvatarId} not found`);
      }
    }

  const newGroup = new this.groupModel({
    Category: category,
    GroupName,
    GroupDescription,
    Avatar: file,
    MemberCount: MemberCount ?? 0,
    PostCount: PostCount ?? 0,
  });

    return newGroup.save();
  }

  async findById(id: string): Promise<GroupDocument | null> {
    return this.groupModel
      .findById(id)
      .populate('groupCategory')
      .populate('groupAvatar')
      .exec();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<GroupDocument | null> {
    const group = await this.groupModel.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    if (updateGroupDto.CategoryId) {
      const category = await this.categoryModel.findById(updateGroupDto.CategoryId);
      if (!category) {
        throw new NotFoundException(`Category with id ${updateGroupDto.CategoryId} not found`);
      }
      group.groupCategory = category;
    }

    if (updateGroupDto.AvatarId) {
      const file = await this.mediaFilesModel.findById(updateGroupDto.AvatarId);
      if (!file) {
        throw new NotFoundException(`Media file with id ${updateGroupDto.AvatarId} not found`);
      }
      group.groupAvatar = file;
    }

    if (updateGroupDto.GroupName) group.groupName = updateGroupDto.GroupName;
    if (updateGroupDto.GroupDescription) group.groupDescription = updateGroupDto.GroupDescription;
    if (updateGroupDto.MemberCount !== undefined) group.memberCount = updateGroupDto.MemberCount;
    return group.save();
  }

  async findAll(): Promise<GroupDocument[]> {
    return this.groupModel
      .find()
      .populate('groupCategory')
      .populate('groupAvatar')
      .exec();
  }

  async delete(id: string): Promise<GroupDocument | null> {
    return this.groupModel.findByIdAndDelete(id).exec();
  }

  async findByName(name: string): Promise<GroupDocument[]> {
    return this.groupModel
      .find({ groupName: { $regex: name, $options: 'i' } })
      .populate('groupCategory')
      .populate('groupAvatar')
      .exec();
  }
}
