import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Jackpot } from "../db/Jackpot";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";
import { roll } from "../utils";

export default class Gamble extends Command {
  name = "gamble";
  aliases = ["g"];

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const amount = parseInt(args[0]);

      if (amount <= 0) {
        throw new Error("cannot bet with 0 :taco: and below");
      }

      validateNumber(amount);
      validateAmount(amount, player.user.balance);

      const rolled = roll();

      await msg.channel.send(`${player.name} rolled ${rolled}`);

      const jackpot = await Jackpot.getMain();

      if (rolled === jackpot.winningNumber) {

        player.user.balance += amount;
        await msg.channel.send(
          `${player.name} WON THE JACKPOT, THEY GOT ${jackpot.amount}:taco:!!!`
        )
      
        jackpot.amount += amount;
        jackpot.winningNumber = roll();

      } else {

        jackpot.amount += amount;
        player.user.balance -= amount;

        await msg.channel.send(`They lost ${amount} :taco:`);
        await msg.channel.send(`Jackpot now at ${jackpot.amount} :taco:`);
      }

      jackpot.save();
      player.user.save();

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
