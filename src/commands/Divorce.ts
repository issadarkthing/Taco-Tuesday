import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class Divorce extends Command {
  name = "divorce";
  description = "divorce your spouse";
  disable = true;

  async exec(msg: Message) {

    try {

      const player = await Player.fromUser(msg.author);
      const user = msg.mentions.users.first();

      if (!user) {
        throw new Error("you need to mention a user");
      }

      const recipient = await Player.fromUser(user);

      if (player.doc.spouse.userID !== recipient.doc.userID) {
        throw new Error(`you are not married to ${recipient.name}`);
      }

      const totalBank = Math.round(player.doc.bank / 2);

      player.doc.spouse.userID = undefined;
      player.doc.spouse.name = undefined;
      player.doc.bank = totalBank;

      recipient.doc.spouse.userID = undefined;
      recipient.doc.spouse.name = undefined;
      recipient.doc.bank = totalBank;

      player.doc.save();
      recipient.doc.save();

      msg.channel.send(`successfully divorced`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
