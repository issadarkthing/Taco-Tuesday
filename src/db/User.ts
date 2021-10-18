import { Model, model, Schema, Document } from "mongoose";

const userSchema = new Schema({
  userID: String,
  balance: { type: Number, default: 0 },
  price: { type: Number, default: 1000 },
  spouse: String,
});

userSchema.statics.findByUserID = function(userID: string) {
  return this.findOne({ userID });
}

export interface UserDocument extends Document {
  userID: string;
  balance: number;
  price: number;
  spouse?: string;
};

export interface UserModel extends Model<UserDocument> {
  findByUserID(userID: string): Promise<UserDocument>;
};

export const User = model<UserDocument>("User", userSchema) as UserModel;
