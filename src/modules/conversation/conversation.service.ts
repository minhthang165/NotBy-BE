import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation, ConversationDocument } from './entities/conversation.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { MediaFiles } from '../mediafiles/entities/mediafile.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MediaFiles.name) private readonly mediaFilesModel: Model<MediaFiles>,
  ) {}

}