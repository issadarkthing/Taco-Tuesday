import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";

export default class Price extends Command {
  name = "price";
  description = "sets a price for yourself when someone wants to marry you";

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const amount = parseInt(args[0]);

      validateNumber(amount);
      validateAmount(amount, player.user.balance);

      player.user.price = amount;

      await player.user.save();

      msg.channel.send(`successfully set ${amount} :taco: as your marry price`);

    } catch (err) {
      
      msg.channel.send((err as Error).message);
    }
  }
}
