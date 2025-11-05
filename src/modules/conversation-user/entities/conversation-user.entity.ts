import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/modules/user/entities/user.entity";
import { Conversation } from "src/modules/conversation/entities/conversation.entity";

export type ConversationUserDocument = HydratedDocument<ConversationUser>;

@Schema({
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
    toJSON: {
        getters: true,
        virtuals: true,
    },
})
export class ConversationUser {
    @Prop({ type: Types.ObjectId })
    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: () => User })
    user: User;

    @Prop({ type: Types.ObjectId, ref: () => Conversation })
    conversation: Conversation;

    @Prop({ type: Boolean, default: false })
    is_admin: boolean;
}

export const ConversationUserSchema = SchemaFactory.createForClass(ConversationUser);

export const ConversationUserSchemaFactory = () => {
    const conversationUserSchema = ConversationUserSchema;

    conversationUserSchema.pre("findOneAndDelete", async function (next) {
        const relation = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });

    return conversationUserSchema;
};
