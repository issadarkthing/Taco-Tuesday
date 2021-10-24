import { UserDocument, User } from "../db/User";
import { MessageEmbed, User as UserDiscord } from "discord.js";
import { Player as BasePlayer } from "discordjs-rpg";

export class Player extends BasePlayer {
  doc: UserDocument;

  constructor(discordUser: UserDiscord, doc: UserDocument) {
    super(discordUser);
    this.doc = doc;
  }

  show() {
    
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(this.user.displayAvatarURL())
      .addField("Balance", `${this.doc.balance} :taco:`, true)
      .addField("Bank", `${this.doc.bank} :taco:`, true)
      .addField("Price to marry", `${this.doc.price} :taco:`, true)
      .addField("Spouse name", `${this.doc.spouse?.name || "none"}`, true)

    return embed;
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
