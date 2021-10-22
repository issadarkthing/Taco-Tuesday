import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Jackpot } from "../db/Jackpot";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";
import { roll } from "../utils";

export default class Gamble extends Command {
  name = "gamble";
  aliases = ["g"];
  description = "gamble your tacos";

  private getResult(rolled: number) {
    if (rolled >= 1 && rolled <= 65) {
      return "lose" as const;

    } else if (rolled >= 66 && rolled <= 97) {
      return "win" as const;

    } else {
      return "jackpot" as const;
    }
  }

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const amount = parseInt(args[0]);

      validateNumber(amount);
      validateAmount(amount, player.user.balance);

      const rolled = roll();

      await msg.channel.send(`${player.name} rolled ${rolled}`);

      const jackpot = await Jackpot.getMain();
      const result = this.getResult(rolled);

      if (result === "lose") {

        jackpot.amount += amount;
        player.user.balance -= amount;

        await msg.channel.send(`They lost ${amount} :taco:`);
        await msg.channel.send(`Jackpot now at ${jackpot.amount} :taco:`);

      } else if (result === "win") {

        const winAmount = amount * 2;
        player.user.balance += winAmount;
        await msg.channel.send(`They win ${winAmount} :taco:`);

      } else if (result === "jackpot") {

        player.user.balance += jackpot.amount;

        await msg.channel.send(
          `${player.name} WON THE JACKPOT, THEY GOT ${jackpot.amount}:taco:!!!`
        )

        jackpot.amount = amount;
      }


      jackpot.save();
      player.user.save();

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
