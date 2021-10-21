import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";
import { random } from "../utils";
import { DateTime } from "luxon";

export default class Battle extends Command {
  name = "battle";
  description = "battle with other person to win taco";
  maxCount = 5;
  cooldownTime = 3; // hours

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

      const lastTime = DateTime.fromJSDate(player.user.cooldowns.battle.time);
      const { count } = player.user.cooldowns.battle;
      const diff = Math.abs(lastTime.diffNow(["hours"]).hours);

      if (diff < this.cooldownTime && count >= this.maxCount) {

        throw new Error("you are on cooldown");

      }

      if (player.user.cooldowns.battle.count >= this.maxCount) {
        player.user.cooldowns.battle.count = 0;
      }

      player.user.cooldowns.battle.time = DateTime.now().toJSDate();
      player.user.cooldowns.battle.count += 1;

      await player.user.save();

      const battleTax = Math.round(amount * 0.2);

      msg.channel.send(`${battleTax} :taco: is taken from ${player.name}`);

      player.user.balance -= amount + battleTax;
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
