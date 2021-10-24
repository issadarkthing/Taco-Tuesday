import { UserDocument, User } from "../db/User";
import { User as UserDiscord } from "discord.js";
import { Player as BasePlayer } from "discordjs-rpg";
import { currency } from "../utils";

export class Player extends BasePlayer {
  doc: UserDocument;

  constructor(discordUser: UserDiscord, doc: UserDocument) {
    super(discordUser);
    this.doc = doc;

    this.doc.armors.forEach(armor => this.equipArmor(armor));
  }

  show() {
    
    const profile = super.show();
    const armorIndex = 8;
    const armor = profile.fields.at(armorIndex)!.value;
    profile.fields.at(armorIndex)!.name = "Balance";
    profile.fields.at(armorIndex)!.value = `${this.doc.balance} ${currency}`;
    profile.fields.at(armorIndex)!.inline = true;

    profile.addField("Bank", `${this.doc.bank} ${currency}`, true);

    profile.addField("Armor", armor);

    return profile;
  }

  static async fromUser(user: UserDiscord) {
 
    let dbUser = await User.findByUserID(user.id);

    if (!dbUser) {
      dbUser = new User({ userID: user.id });
      await dbUser.save();
    }

    const player = new Player(user, dbUser);

    return player;
  }
}
