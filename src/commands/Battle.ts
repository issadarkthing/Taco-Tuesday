import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";
import { random } from "../utils";

export default class Battle extends Command {
  name = "battle";
  description = "battle with other person to win taco";

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const amount = parseInt(args[1]);

      validateNumber(amount);
      validateAmount(amount, player.user.balance);

      const mentionedUser = msg.mentions.users.first();

      if (!mentionedUser) {
        throw new Error(`You need to mention a user`);
      }

      const opponent = await Player.fromUser(mentionedUser);

      if (opponent.user.balance < amount) {
        throw new Error(`${opponent.name} has insufficient balance`);
      }

      player.user.balance -= amount;
      opponent.user.balance -= amount;

      const [winner, loser] = random.shuffle([player, opponent]);

      winner.user.balance += amount * 2;

      winner.user.save();
      loser.user.save();

      msg.channel.send(`${winner.name} wins over ${opponent.name}!`);
      msg.channel.send(`${winner.name} earns ${amount * 2} :taco:`);
      msg.channel.send(`${loser.name} loses ${amount} :taco:`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}