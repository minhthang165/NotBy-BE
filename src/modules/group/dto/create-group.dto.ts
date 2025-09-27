import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Category ID' })
    CategoryId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Group Name' })
    GroupName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Group Description' })
    GroupDescription: string;

    @IsString()
    @ApiProperty({ description: 'Avatar Id', required: false })
    AvatarId: string;

    @IsNumber()
    @ApiProperty({ description: 'Number of Members' })
    MemberCount: number;

    @IsNumber()
    @ApiProperty({ description: 'Number of Post' })
    PostCount: number;
}
