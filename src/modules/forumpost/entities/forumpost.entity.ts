import { HydratedDocument, Types } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';
import { MediaFiles } from 'src/modules/mediafiles/entities/mediafile.entity';
import { group } from 'console';

export type ForumPostDocument = HydratedDocument<ForumPost>

// auto generate createdAt and updatedAt fields in mongoDB
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
export class ForumPost {
    @Prop()
    Title: string;
    @Prop()
    Content: string;
    @Prop()
    Likes: number;
    @Prop()
    Views: number;
    @Prop({ type: Types.ObjectId, ref: () => User })
    Author: User;
    @Prop({ type: Types.ObjectId, ref: () => MediaFiles })
    File: MediaFiles;
}

export const ForumPostSchema = SchemaFactory.createForClass(ForumPost);
export const ForumPostSchemaFactory = () => {
    const forumPostSchema = ForumPostSchema;

    forumPostSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const mediaFile = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return forumPostSchema;
};