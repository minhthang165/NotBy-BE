import { HydratedDocument, Types } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { MediaFiles } from 'src/modules/mediafiles/entities/mediafile.entity';

export type ArticleDocument = HydratedDocument<Article>

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
export class Article{
    @Prop({ type: Types.ObjectId, ref: () => Category })
    Category: Category;
    @Prop()
    Title: string;
    @Prop()
    Content: string;
    @Prop({ type: Types.ObjectId, ref: () => MediaFiles })
    File: MediaFiles;
    @Prop({ type: Types.ObjectId, ref: () => User })
    Author: User;
    @Prop()
    Likes: number;
    @Prop()
    Views: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
export const ArticleSchemaFactory = () => {
    const articleSchema = ArticleSchema;

    articleSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const article = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return articleSchema;
};