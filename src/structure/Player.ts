import { UserDocument, User } from "../db/User";
import { User as UserDiscord } from "discord.js";
import { Player as BasePlayer } from "discordjs-rpg";
import { currency } from "../utils";
import { BaseArmor } from "./Armor";

export class Player extends BasePlayer {
  doc: UserDocument;

  constructor(discordUser: UserDiscord, doc: UserDocument) {
    super(discordUser);
    this.doc = doc;

    this.armors.forEach(armor => this.equipArmor(armor));
  }

  /** array of equipped armors */
  get armors() {
    return this.doc.equippedArmors
      .map(armorID => BaseArmor.all.find(x => x.id === armorID)!);
  }

  /** array of armors in inventory */
  get armorInventory() {
    return this.doc.armors
      .map(armorID => BaseArmor.all.find(x => x.id === armorID)!);
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

  get inventory() {
    return [
      ...this.armorInventory,
    ];
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
