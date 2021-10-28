import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateNumber, validateAmount, random, currency, bold } from "../utils";
import { ButtonHandler } from "../structure/ButtonHandler";

export default class extends Command {
  name = "color";
  colors = ["🍏", "🌻", "📘", "🍎", "🌸"];

  async exec(msg: Message, args: string[]) {

    try {

      const amount = parseInt(args[0]);
      const player = await Player.fromUser(msg.author);

      if (!amount) throw new Error("Please place a bet");

      validateNumber(amount);
      validateAmount(amount, player.doc.balance);

      player.doc.balance -= amount;

      const menu = new ButtonHandler(msg, "Please select color up to 3 colors")
        .setMax(10);

      let selected: string[] = [];

      for (const color of this.colors) {
        menu.addButton(color, () => { 

          if (selected.includes(color)) {
            msg.channel.send(`You already selected ${color}`);
            return;
          }

          selected.push(color);
          msg.channel.send(`${color} has been selected`);

          if (selected.length >= 3) {
            menu.close();
          }
        });
      }

      await menu.run();

      if (selected.length === 0) throw new Error("No color was picked");

      const winningColors = random.sample(this.colors, 3);

      msg.channel.send(`Result: ${winningColors.join(" ")}`);

      let hitCount = 0;

      for (const winningColor of winningColors) {
        if (selected.includes(winningColor)) {
          hitCount++;
        }
      }

      if (hitCount === 0) {
        msg.channel.send(`${player.name} just lost ${bold(amount)} ${currency}`);
      } else {

        const multiplier = hitCount + 1;
        const winAmount = amount * multiplier;

        player.doc.balance += winAmount;
        msg.channel.send(
          `${player.name} hit ${hitCount} colors and won ${bold(winAmount)} ${currency}`
        )
      }

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
