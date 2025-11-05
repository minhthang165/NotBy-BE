import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';
export class ConversationDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Conversation Name' })
    conversation_name: string;
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Conversation Avatar URL' })
    conversation_avatar?: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Conversation Type' })
    type: string;
}