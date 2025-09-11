import { IsMongoId, IsString, IsEnum, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateBabyDto {
	@IsMongoId()
	parentId: string;

	@IsString()
	@MaxLength(50)
	firstName: string;

	@IsString()
	@MaxLength(50)
	lastName: string;

	@IsDateString()
	dob: Date;

	@IsEnum(['Male', 'Female', 'Other'])
	gender: 'Male' | 'Female' | 'Other';
}
