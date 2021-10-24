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
  disable = true;

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

      const [player, jackpot] = await Promise.all([
        Player.fromUser(msg.author),
        await Jackpot.getMain(),
      ]);

      const amount = parseInt(args[0]);

      validateNumber(amount);
      validateAmount(amount, player.doc.balance);

      const rolled = roll();

      msg.channel.send(`${player.name} rolled ${rolled}`);

      const result = this.getResult(rolled);

      if (result === "lose") {

        jackpot.amount += amount;
        player.doc.balance -= amount;

        msg.channel.send(`They lost ${amount} :taco:`);
        msg.channel.send(`Jackpot now at ${jackpot.amount} :taco:`);

      } else if (result === "win") {

        const winAmount = amount * 2;
        player.doc.balance += winAmount;
        msg.channel.send(`They win ${winAmount} :taco:`);

      } else if (result === "jackpot") {

        player.doc.balance += jackpot.amount;

        msg.channel.send(
          `${player.name} WON THE JACKPOT, THEY GOT ${jackpot.amount}:taco:!!!`
        )

        jackpot.amount = amount;
      }


      jackpot.save();
      player.doc.save();

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
