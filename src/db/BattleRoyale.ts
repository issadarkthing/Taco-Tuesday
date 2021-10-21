import { Model, model, Document, Schema } from "mongoose";

const battleRoyaleSchema = new Schema({
  participantsID: { type: Array, default: [] },
  prize: { type: Number },
  status: { type: String, default: "active" },
})

export interface BattleRoyaleDocument extends Document {
  participantsID: string[];
  prize: number;
  status: "active" | "inactive";
}

battleRoyaleSchema.statics.getMain = async function() {
  let doc = await this.findOne({});

  if (!doc) {
    doc = new BattleRoyale();
    await doc.save();
  }

  return doc;
}

export interface BattleRoyaleModel extends Model<BattleRoyaleDocument> {
  getMain(): Promise<BattleRoyaleDocument>;
};

export const BattleRoyale = 
  model("BattleRoyale", battleRoyaleSchema) as BattleRoyaleModel;
