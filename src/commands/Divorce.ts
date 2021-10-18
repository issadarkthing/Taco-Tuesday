import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class Divorce extends Command {
  name = "divorce";

  async exec(msg: Message) {

    try {

      const player = await Player.fromUser(msg.author);
      const user = msg.mentions.users.first();

      if (!user) {
        throw new Error("you need to mention a user");
      }

      const recipient = await Player.fromUser(user);

      if (player.user.spouse.userID !== recipient.user.userID) {
        throw new Error(`you are not married to ${recipient.name}`);
      }

      player.user.spouse.userID = undefined;
      player.user.spouse.name = undefined;

      recipient.user.spouse.userID = undefined;
      recipient.user.spouse.name = undefined;

      player.user.save();
      recipient.user.save();

      msg.channel.send(`successfully divorced`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
