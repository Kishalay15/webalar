import { ILog } from "./models.types";
import mongoose, { Schema } from "mongoose";

const logSchema: Schema<ILog> = new Schema<ILog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetType: { type: String, enum: ["Task", "User"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    details: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Log = mongoose.model<ILog>("Log", logSchema);
