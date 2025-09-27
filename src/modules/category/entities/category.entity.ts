import { HydratedDocument } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';

export type CategoryDocument = HydratedDocument<Category>

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
export class Category{
    @Prop()
    Title: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategorySchemaFactory = () => {
    const categorySchema = CategorySchema;

    categorySchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const category = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return categorySchema;
};