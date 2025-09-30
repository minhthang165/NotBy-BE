import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    email: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    dob: Date;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    googleId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    gender: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'String' })
    photo: string;

    @IsIn(['User', 'Admin', 'HR'])
    @ApiProperty({ description: 'User/Admin/HR' })
    role: string;
}
