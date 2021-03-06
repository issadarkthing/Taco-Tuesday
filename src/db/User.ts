import mongoose, { Model, Document } from "mongoose";
import { DateTime } from "luxon";

const userSchema = new mongoose.Schema({
  userID: String,
  balance: { type: Number, default: 1000 },
  price: { type: Number, default: 5000 },
  armors: [String],
  equippedArmors: [String],
  weapons: [String],
  equippedWeapons: [String],
  skills: [String],
  activeSkill: String,
  pets: [String],
  activePet: String,
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
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
  level: number;
  xp: number;
  armors: string[];
  equippedArmors: string[];
  weapons: string[];
  equippedWeapons: string[];
  skills: string[];
  activeSkill?: string;
  pets: string[];
  activePet?: string;
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

export const User = mongoose.model<UserDocument>("User", userSchema) as UserModel;
