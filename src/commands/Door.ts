import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { ButtonHandler } from "../structure/ButtonHandler";
import { bold, currency, random, validateAmount, validateNumber } from "../utils";

export default class extends Command {
  name = "door";
  doorEmoji = "🚪";
  bagEmoji = "💰";

  async exec(msg: Message, args: string[]) {

    try {

      const amount = parseInt(args[0]);
      const player = await Player.fromUser(msg.author);

      if (!amount) throw new Error("Please place a bet");

      validateNumber(amount);
      validateAmount(amount, player.doc.balance);

      player.doc.balance -= amount;

      const menu = new ButtonHandler(msg, 
        `Please select a door: 1. ${this.doorEmoji} 2. ${this.doorEmoji} 3. ${this.doorEmoji}`
      );

      let selected = 0;

      menu.addButton("1", () => { selected = 1 });
      menu.addButton("2", () => { selected = 2 });
      menu.addButton("3", () => { selected = 3 });

      await menu.run();

      if (selected === 0) throw new Error("no door was selected");

      const winningDoor = random.integer(1, 3);
      const doors = Array<string>(3).fill(this.doorEmoji);

      doors[winningDoor - 1] = this.bagEmoji;

      msg.channel.send(`Result: ${doors.join(" ")}`);

      if (selected === winningDoor) {

        const winAmount = amount * 2;
        player.addBalanceAndShow(msg, winAmount);

      } else {
        msg.channel.send(`${player.name} has lost ${bold(amount)} ${currency}`);
      }

      player.doc.save();

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
