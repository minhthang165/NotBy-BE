import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupMemberDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Group Id' })
    GroupId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Member Id' })
    UserId: string;
}
