import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId });
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async findAll(
		searchPhase?: string,
		page = 0,
		limit = 10,
		sortBy?: string,
		sortOrder: 'asc' | 'desc' = 'asc',
	): Promise<any> {
		const query: FilterQuery<User> = {};

		if (searchPhase) {
			query.$or = [
				{ firstName: { $regex: searchPhase, $options: 'i' } },
				{ lastName: { $regex: searchPhase, $options: 'i' } },
				{ email: { $regex: searchPhase, $options: 'i' } },
				{ phoneNumber: { $regex: searchPhase, $options: 'i' } },
				{
					$expr: {
						$regexMatch: {
							input: { $concat: ['$firstName', ' ', '$lastName'] },
							regex: searchPhase,
							options: 'i',
						},
					},
				},
			];
		}

		const total = await this.userModel.countDocuments(query);

		const users = await this.userModel
			.find(query)
			.sort({ [sortBy ?? 'created_at']: sortOrder === 'asc' ? 1 : -1 })
			.skip(page * limit)
			.limit(limit);

		return {
			total,
			page,
			limit,
			users,
		};
	}

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getByRole(role: string): Promise<UserDocument[]> {
	return this.userModel.find({ role }).exec();
  }
}
