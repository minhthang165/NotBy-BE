import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupMemberDto } from './create-groupMember.dto';

export class UpdateGroupMemberDto extends PartialType(CreateGroupMemberDto) {}