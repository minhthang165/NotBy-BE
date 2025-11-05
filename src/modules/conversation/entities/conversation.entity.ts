import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { NextFunction } from "express";
import { MediaFiles } from "src/modules/mediafiles/entities/mediafile.entity";

export type ConversationDocument = HydratedDocument<Conversation>;

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
export class Conversation {
    @Prop({ type: Types.ObjectId })
    _id?: Types.ObjectId;

    @Prop({ type: String, maxlength: 255 })
    conversation_name: string;

    @Prop({ type: Types.ObjectId, ref: MediaFiles.name })
    conversation_avatar: MediaFiles;

    @Prop({ type: String, maxlength: 255 })
    type: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

export const ConversationSchemaFactory = () => {
    const conversationSchema = ConversationSchema;

    // Example hook (optional)
    conversationSchema.pre("findOneAndDelete", async function (next: NextFunction) {
        const convo = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });

    return conversationSchema;
};
