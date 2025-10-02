import { HydratedDocument, Types } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

export type MediaFilesDocument = HydratedDocument<MediaFiles>

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
export class MediaFiles{
    @Prop()
    fileName: string;
    @Prop({enum: ['image', 'video', 'other']})
    fileType: string;
    @Prop({ type: Types.ObjectId, ref: () => User })
    Author: User;
    @Prop({ unique: true })
    fileUrl: string;
}

export const MediaFilesSchema = SchemaFactory.createForClass(MediaFiles);
export const MediaFilesSchemaFactory = () => {
    const mediaFilesSchema = MediaFilesSchema;

    mediaFilesSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const mediaFile = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return mediaFilesSchema;
};