import { HydratedDocument, Types } from 'mongoose';
import { Constructor } from 'ts-jest/node_modules/type-fest/source/basic';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';
import { Group } from 'src/modules/group/entities/group.entity';
import { User } from 'src/modules/user/entities/user.entity';

export type GroupMemberDocument = HydratedDocument<GroupMember>

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
export class GroupMember{
    @Prop()
    isAdmin : boolean;
    @Prop({type : Types.ObjectId, ref: () => User})
    User: User;
    @Prop({type : Types.ObjectId, ref: () => Group})
    Group: Group;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
export const GroupMemberSchemaFactory = () => {
    const groupMemberSchema = GroupMemberSchema;
    groupMemberSchema.index({ User: 1, Group: 1 }, { unique: true });
    groupMemberSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const mediaFile = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return groupMemberSchema;
};