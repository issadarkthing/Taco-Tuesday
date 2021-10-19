import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { DateTime } from "luxon";

export default class extends Command {
  name = "daily";
  reward = 200;

  async exec(msg: Message) {

    const player = await Player.fromUser(msg.author);
    const lastClaim = DateTime.fromJSDate(player.user.lastClaim.daily);
    const now = DateTime.now();
    const diff = now.diff(lastClaim, ["days"]);

    if (diff.days > 1) {
      
      player.user.balance += this.reward;
      player.user.lastClaim.daily = now.toJSDate();
      msg.channel.send(`Claimed daily reward! Earned ${this.reward} :taco:`);
      player.user.save();

    } else {

      msg.channel.send(`You already claimed for today`);
  
    }
  }
}
