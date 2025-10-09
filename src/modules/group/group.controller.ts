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
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  async findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const group = await this.groupService.findById(id);
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  @Get('name/:name')
    async findByName(@Param('name') name: string) {
    const groups = await this.groupService.findByName(name);
    if (!groups || groups.length === 0) {
      throw new NotFoundException(`No groups found with name containing '${name}'`);
    }
    return groups;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const updatedGroup = await this.groupService.update(id, updateGroupDto);
    if (!updatedGroup) throw new NotFoundException('Group not found');
    return updatedGroup;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedGroup = await this.groupService.delete(id);
    if (!deletedGroup) throw new NotFoundException('Group not found');
    return deletedGroup;
  }
}
