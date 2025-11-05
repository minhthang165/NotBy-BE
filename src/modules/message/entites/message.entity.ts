import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { NextFunction } from "express";
import { Conversation } from "src/modules/conversation/entities/conversation.entity";
import { User } from "src/modules/user/entities/user.entity";

export type MessageDocument = HydratedDocument<Message>;

export enum MessageStatus {
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
}

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
export class Message {
    @Prop({ type: Types.ObjectId })
    _id?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: () => Conversation })
    conversation: Conversation;

    @Prop({ type: String })
    message_content: string;

    @Prop({ type: String })
    message_type: string;

    @Prop({
        type: String,
        enum: Object.values(MessageStatus),
        default: MessageStatus.SENT,
    })
    status: MessageStatus;

    @Prop({ type: Types.ObjectId, ref: () => User })
    sender: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export const MessageSchemaFactory = () => {
    const messageSchema = MessageSchema;

    messageSchema.pre("findOneAndDelete", async function (next: NextFunction) {
        const msg = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });

    return messageSchema;
};
