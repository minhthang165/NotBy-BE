import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { GroupMemberService } from './groupMember.service';
import { CreateGroupMemberDto } from './dto/create-groupMember.dto';
import { UpdateGroupMemberDto } from './dto/update-groupMember.dto';

@Controller('GroupMember')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  async create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMemberService.create(createGroupMemberDto);
  }

  @Get()
  async findAll() {
    return this.groupMemberService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const group = await this.groupMemberService.findById(id);
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    const groups = await this.groupMemberService.findByUserId(userId);
    if (!groups || groups.length === 0) {
      throw new NotFoundException(`No groups found for user with id '${userId}'`);
    }
    return groups;
  }

  @Get('group/:groupId')
  async findByGroupId(@Param('groupId') groupId: string) {
    const users = await this.groupMemberService.findByGroupId(groupId);
    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found for group with id '${groupId}'`);
    }
    return users;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ) {
    const updatedGroup = await this.groupMemberService.update(id, updateGroupMemberDto);
    if (!updatedGroup) throw new NotFoundException('Group not found');
    return updatedGroup;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedGroup = await this.groupMemberService.delete(id);
    if (!deletedGroup) throw new NotFoundException('Group not found');
    return deletedGroup;
  }
}
