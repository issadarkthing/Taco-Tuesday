import { UserDocument, User } from "../db/User";
import { GuildMember, MessageEmbed } from "discord.js";

export class Player {

  constructor(
    private member: GuildMember, 
    private user: UserDocument,
  ) {}

  show() {
    
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(this.member.displayAvatarURL())
      .addField("Balance", `${this.user.balance}`, true)
      .addField("Price to marry", `${this.user.price}`, true)

    if (this.user.spouse) {
      embed.addField("Spouse name", `${this.user.spouse}`, true)
    }
  }

  static async fromMember(member: GuildMember) {
 
    let user = await User.findByUserID(member.id);

    if (!user) {
      user = new User({ userID: member.id });
      await user.save();
    }

    const player = new Player(member, user);

    return player;
  }
}
