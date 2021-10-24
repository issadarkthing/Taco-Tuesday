import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { validateAmount, validateNumber } from "../utils";
import { random } from "../utils";
import { DateTime } from "luxon";

export default class extends Command {
  name = "duel";
  description = "duel with other person to win taco";
  maxCount = 5;
  cooldownTime = 1; // hours

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const amount = parseInt(args[1]);

      validateNumber(amount);
      validateAmount(amount, player.doc.balance);

      const mentionedUser = msg.mentions.users.first();

      if (!mentionedUser) {
        throw new Error(`You need to mention a user`);
      }

      const opponent = await Player.fromUser(mentionedUser);

      if (opponent.doc.balance < amount) {
        throw new Error(`${opponent.name} has insufficient balance`);
      }

      const lastTime = DateTime.fromJSDate(player.doc.cooldowns.battle.time);
      const { count } = player.doc.cooldowns.battle;
      const diff = Math.abs(lastTime.diffNow(["hours"]).hours);

      if (diff < this.cooldownTime && count >= this.maxCount) {

        throw new Error("you are on cooldown");

      }

      if (player.doc.cooldowns.battle.count >= this.maxCount) {
        player.doc.cooldowns.battle.count = 0;
      }

      player.doc.cooldowns.battle.time = DateTime.now().toJSDate();
      player.doc.cooldowns.battle.count += 1;

      await player.doc.save();

      const battleTax = Math.round(amount * 0.2);

      msg.channel.send(`${battleTax} :taco: is taken from ${player.name}`);

      player.doc.balance -= amount + battleTax;
      opponent.doc.balance -= amount;

      const [winner, loser] = random.shuffle([player, opponent]);

      winner.doc.balance += amount * 2;

      winner.doc.save();
      loser.doc.save();

      msg.channel.send(`${winner.name} wins over ${opponent.name}!`);
      msg.channel.send(`${winner.name} earns ${amount * 2} :taco:`);
      msg.channel.send(`${loser.name} loses ${amount} :taco:`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
