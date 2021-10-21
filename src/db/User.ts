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
  cooldowns: {
    battle: {
      count: { type: Number, default: 0 },
      // most recent time the command was called
      time: { type: Date, default: () => DateTime.local(2017) },
    }
  },
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
  cooldowns: {
    battle: {
      count: number;
      time: Date;
    }
  };
};

export interface UserModel extends Model<UserDocument> {
  findByUserID(userID: string): Promise<UserDocument>;
};

export const User = model<UserDocument>("User", userSchema) as UserModel;
