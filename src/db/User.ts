import { Model, model, Schema, Document } from "mongoose";
import { DateTime } from "luxon";

const userSchema = new Schema({
  userID: String,
  balance: { type: Number, default: 1000 },
  price: { type: Number, default: 5000 },
  spouse: {
    userID: String,
    name: String,
  },
  lastClaim: {
    daily: { 
      type: Date,
      default: () => DateTime.local(2017, 1, 1).toJSDate(),
    },
    weekly: {
      type: Date,
      default: () => DateTime.local(2017, 1, 1).toJSDate(),
    },
  },
  bank: { type: Number, default: 0 },
});

userSchema.statics.findByUserID = function(userID: string) {
  return this.findOne({ userID });
}

export interface UserDocument extends Document {
  userID: string;
  balance: number;
  price: number;
  spouse: {
    userID?: string;
    name?: string;
  };
  lastClaim: {
    daily: Date;
    weekly: Date;
  };
  bank: number;
};

export interface UserModel extends Model<UserDocument> {
  findByUserID(userID: string): Promise<UserDocument>;
};

export const User = model<UserDocument>("User", userSchema) as UserModel;
