import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type BabyDocument = HydratedDocument<Baby>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
	toJSON: {
		getters: true,
		virtuals: true,
	},
}) 
export class Baby extends BaseEntity {
	constructor(baby: {
		parentId: mongoose.Types.ObjectId;
		firstName: string;
		lastName: string;
		dob: Date;
		gender: 'Male' | 'Female' | 'Other';
	}) {
		super();
		this.parentId = baby?.parentId;
		this.firstName = baby?.firstName;
		this.lastName = baby?.lastName;
		this.dob = baby?.dob;
		this.gender = baby?.gender;
	}

	@Prop({ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    })
	parentId: mongoose.Types.ObjectId;

	@Prop({ type: String, required: true })
	firstName: string;

	@Prop({ type: String, required: true })
	lastName: string;

	@Prop({ type: Date, required: true })
	dob: Date;

	@Prop({ type: String, enum: ['Male', 'Female', 'Other'], required: true })
	gender: string;
}

export const BabySchema = SchemaFactory.createForClass(Baby);

export const BabySchemaFactory = () => {
	const babySchema = BabySchema;

	babySchema.pre('findOneAndDelete', async function (next: NextFunction) {
		const baby = await this.model.findOne(this.getFilter()).populate('parentId');
		await Promise.all([]);
		return next();
	});

	return babySchema;
};
