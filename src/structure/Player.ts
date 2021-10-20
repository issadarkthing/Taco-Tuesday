import { UserDocument, User } from "../db/User";
import { MessageEmbed, User as UserDiscord } from "discord.js";

export class Player {

  constructor(
    private discordUser: UserDiscord, 
    public user: UserDocument,
  ) {}

  get name() {
    return this.discordUser.username;
  }

  show() {
    
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(this.discordUser.displayAvatarURL())
      .addField("Balance", `${this.user.balance} :taco:`, true)
      .addField("Bank", `${this.user.bank} :taco:`, true)
      .addField("Price to marry", `${this.user.price} :taco:`, true)
      .addField("Spouse name", `${this.user.spouse?.name || "none"}`, true)

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
