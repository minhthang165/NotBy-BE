import { HydratedDocument } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type UserDocument = HydratedDocument<User>

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
export class User extends BaseEntity {
	
	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;
	
	@Prop({ required: true })
	dob: Date;

	@Prop({ required: true, unique: true })
	phoneNumber: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    googleId: string;

    @Prop()
    photo: string;

	@Prop({ default: 'Parent', enum: ['Parent', 'Admin'] })
  	role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchemaFactory = () => {
	const userSchema = UserSchema;

	userSchema.pre('findOneAndDelete', async function (next: NextFunction) {
		const user = await this.model.findOne(this.getFilter());
		await Promise.all([]);
		return next();
	});
	return userSchema;
};