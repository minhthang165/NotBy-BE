import { HydratedDocument, Types } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';
import { MediaFiles } from 'src/modules/mediafiles/entities/mediafile.entity';
import { ForumPost } from 'src/modules/forumpost/entities/forumpost.entity';

export type ForumCommentDocument = HydratedDocument<ForumComment>

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
export class ForumComment {
    @Prop({type: Types.ObjectId, ref: () => ForumPost })
    Post: ForumPost;
    @Prop()
    Content: string;
    @Prop()
    Likes: number;
    @Prop({type: Types.ObjectId, ref: () => User })
    CreatedBy: User;
    @Prop({ type: Types.ObjectId, ref: () => MediaFiles })
    File: MediaFiles;
}

export const ForumCommentSchema = SchemaFactory.createForClass(ForumComment);
export const ForumCommentSchemaFactory = () => {
    const forumCommentSchema = ForumCommentSchema;

    forumCommentSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const mediaFile = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return forumCommentSchema;
};