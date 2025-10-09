import { PartialType } from '@nestjs/mapped-types';
import { CreateForumpostDto } from './create-forumpost.dto';

export class UpdateForumpostDto extends PartialType(CreateForumpostDto) {
}
