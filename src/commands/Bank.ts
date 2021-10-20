import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";

export default class Bank extends Command {
  name = "bank";
  description = "save tacos inside bank";

  async exec(msg: Message, args: string[]) {

    try {

      const action = args[0];
      const amount = parseInt(args[1]);
      const player = await Player.fromUser(msg.author);

      validateNumber(amount);

      if (action === "in") {
      
        validateAmount(amount, player.user.balance);

        player.user.bank += amount;
        player.user.balance -= amount;

        msg.channel.send(`Successfully banked in ${amount} :taco:`);

      } else if (action === "out") {
        
        validateAmount(amount, player.user.bank);

        player.user.bank -= amount;
        player.user.balance += amount;

        msg.channel.send(`Successfully banked out ${amount} :taco:`);

      } else {
        throw new Error("invalid action");
      }

      player.user.save();

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
