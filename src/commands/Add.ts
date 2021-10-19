import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateNumber } from "../utils";
import { adminID, devID } from "../index";

export default class Add extends Command {
  name = "add";

  async exec(msg: Message, args: string[]) {

    if (adminID !== msg.author.id && msg.author.id !== devID) {
      return;
    }

    try {

      const user = msg.mentions.users.first();
      const amount = parseInt(args[1]);

      validateNumber(amount);

      if (!user) {
        throw new Error("you need to mention a user");
      }

      const recipient = await Player.fromUser(user);

      recipient.user.balance += amount;
      recipient.user.save();

      await msg.channel.send(
        `Successfully add ${amount} :taco: to ${recipient.name}`
      );


    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}

