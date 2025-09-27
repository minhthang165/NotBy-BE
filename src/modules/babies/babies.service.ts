import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';
import { Baby, BabyDocument } from './entities/baby.entity';

@Injectable()
export class BabiesService {
	constructor(
		@InjectModel(Baby.name) private readonly babyModel: Model<BabyDocument>,
	) {}

	async create(createBabyDto: CreateBabyDto): Promise<Baby> {
		const newBaby = new this.babyModel(createBabyDto);
		return await newBaby.save();
	}

	async findAll(
    searchPhase?: string,
    page = 0,
    limit = 10,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<any> {
    const query: FilterQuery<Baby> = {};

    if (searchPhase) {
      query.$or = [
        { firstName: { $regex: searchPhase, $options: 'i' } },
        { lastName: { $regex: searchPhase, $options: 'i' } },
        { 
          $expr: { 
            $regexMatch: { 
              input: { $concat: ['$firstName', ' ', '$lastName'] },
              regex: searchPhase,
              options: 'i'
            } 
          } 
        }
      ];
    }

	const total = await this.babyModel.countDocuments(query);

	const babies = await this.babyModel
		.find(query)
		.sort({ [sortBy ?? 'created_at']: sortOrder === 'asc' ? 1 : -1 })
		.populate('parentId')
		.skip(page * limit)
		.limit(limit);

	return {
		total,
		page,
		limit,
		babies,
	};
}

	async findOne(id: string): Promise<Baby> {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Baby with id "${id}" not found`);
		}
		const baby = await this.babyModel.findById(id).populate('parentId').exec();
		if (!baby) {
			throw new NotFoundException(`Baby with id "${id}" not found`);
		}
		return baby;
	}

	async update(id: string, updateBabyDto: UpdateBabyDto): Promise<Baby> {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Baby with id "${id}" not found`);
		}
		const updatedBaby = await this.babyModel
			.findByIdAndUpdate(id, updateBabyDto, { new: true })
			.populate('parentId')
			.exec();
		if (!updatedBaby) {
			throw new NotFoundException(`Baby with id "${id}" not found`);
		}
		return updatedBaby;
	}

	async remove(id: string): Promise<Baby> {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Baby with id "${id}" not found`);
		}
		const deletedBaby = await this.babyModel
			.findByIdAndDelete(id)
			.populate('parentId')
			.exec();
		if (!deletedBaby) {
			throw new NotFoundException(`Baby with id "${id}" not found`);
		}
		return deletedBaby;
	}


}
