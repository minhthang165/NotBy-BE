import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';

export class ConversationUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'User ID' })
    user: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Conversation ID' })
    conversation: string;
    @IsOptional()
    @ApiProperty({ description: 'Is Admin', default: false })
    is_admin?: boolean;
}