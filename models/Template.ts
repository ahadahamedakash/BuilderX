import { Schema, model, models, Document, Types } from "mongoose";

export interface ITemplate extends Document {
  userId: Types.ObjectId;
  name: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TemplateSchema.index({ userId: 1, name: 1 }, { unique: true });

const Template = models.Template || model<ITemplate>("Template", TemplateSchema);

export default Template;


