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
      
        validateAmount(amount, player.doc.balance);

        player.doc.bank += amount;
        player.doc.balance -= amount;

        msg.channel.send(`Successfully banked in ${amount} :taco:`);

      } else if (action === "out") {
        
        validateAmount(amount, player.doc.bank);

        player.doc.bank -= amount;
        player.doc.balance += amount;

        msg.channel.send(`Successfully banked out ${amount} :taco:`);

      } else {
        throw new Error("invalid action");
      }

      player.doc.save();

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
