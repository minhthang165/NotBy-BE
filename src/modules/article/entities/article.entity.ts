import { HydratedDocument } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';

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
    @Prop()
    CategoryId: string;
    @Prop()
    Title: string;
    @Prop()
    Content: string;
    @Prop()
    FileId: string;
    @Prop()
    Author: string;
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