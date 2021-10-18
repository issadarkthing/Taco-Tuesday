import { Model, model, Schema, Document } from "mongoose";
import { roll } from "../utils";

const jackpotSchema = new Schema({
  amount: { type: Number, default: 100 },
  winningNumber: Number,
});

export interface JackpotDocument extends Document {
  amount: number;
  winningNumber: number;
};

jackpotSchema.statics.getMain = async function() {
  let doc = await this.findOne({});

  if (!doc) {
    doc = new Jackpot();
    doc.winningNumber = roll();
    await doc.save();
  }

  return doc;
}

export interface JackpotModel extends Model<JackpotDocument> {
  getMain(): Promise<JackpotDocument>;
};

export const Jackpot = model<JackpotDocument>("Jackpot", jackpotSchema) as JackpotModel;
