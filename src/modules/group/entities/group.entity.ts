import { HydratedDocument, Types } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { MediaFiles } from 'src/modules/mediafiles/entities/mediafile.entity';
import { Category } from 'src/modules/category/entities/category.entity';

export type GroupDocument = HydratedDocument<Group>

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
export class Group{
    @Prop()
    groupName: string;
    @Prop({type : Types.ObjectId, ref: () => Category})
    groupCategory: Category;
    @Prop({type : Types.ObjectId, ref: () => MediaFiles})
    groupAvatar: MediaFiles;
    @Prop()
    groupDescription: string;
    @Prop()
    memberCount: number;
    @Prop()
    postCount: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
export const GroupSchemaFactory = () => {
    const groupSchema = GroupSchema;

    groupSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const mediaFile = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return groupSchema;
};