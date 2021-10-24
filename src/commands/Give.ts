import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";

export default class Give extends Command {
  name = "give";
  description = "give tacos to other player";

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const user = msg.mentions.users.first();
      const amount = parseInt(args[1]);

      validateNumber(amount);
      validateAmount(amount, player.doc.balance);

      if (!user) {
        throw new Error("you need to mention a user");
      }

      const recipient = await Player.fromUser(user);

      player.doc.balance -= amount;
      recipient.doc.balance += amount;

      player.doc.save();
      recipient.doc.save();

      await msg.channel.send(
        `${player.name} gave ${recipient.name} ${amount} :taco:`
      );

      await msg.channel.send(
        `They have ${recipient.doc.balance} :taco: left`
      )

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
