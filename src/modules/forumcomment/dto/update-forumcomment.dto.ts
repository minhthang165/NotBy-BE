import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateForumcommentDto } from './create-forumcomment.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateForumcommentDto extends PartialType(CreateForumcommentDto) {
}