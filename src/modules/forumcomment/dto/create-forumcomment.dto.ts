import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateForumcommentDto {
  @ApiProperty({
    description: 'The content of the forum comment',
    example: 'This is a helpful comment about the topic.'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  Content: string;

  @ApiProperty({
    description: 'The ID of the forum post this comment belongs to',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsNotEmpty()
  @IsMongoId()
  ForumPostId: string;

  @ApiProperty({
    description: 'File Id',
    example: '60d21b4667d0d8992e610c85',
    required: false
    })
    @IsOptional()
    @IsString()
    FileId?: string;
    
  @ApiProperty({
    description: 'Author ID',
    example: '60d21b4667d0d8992e610c85'
    })
    @IsNotEmpty()
    @IsString()
    CreatedBy: string;

  @ApiProperty({
    description: 'Number of likes',
    example: 10,
    required: false
    })
    @IsOptional()
    Likes?: number = 0;
}