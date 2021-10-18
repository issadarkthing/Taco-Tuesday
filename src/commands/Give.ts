import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";

export default class Give extends Command {
  name = "give";

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const user = msg.mentions.users.first();
      const amount = parseInt(args[1]);

      validateNumber(amount);
      validateAmount(amount, player.user.balance);

      if (!user) {
        throw new Error("you need to mention a user");
      }

      const recipient = await Player.fromUser(user);

      player.user.balance -= amount;
      recipient.user.balance += amount;

      player.user.save();
      recipient.user.save();

      await msg.channel.send(
        `${player.name} gave ${recipient.name} ${amount} :taco:`
      );

      await msg.channel.send(
        `They have ${recipient.user.balance} :taco: left`
      )

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
