import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { DateTime } from "luxon";

export default class extends Command {
  name = "daily";
  description = "claim daily taco";
  reward = 200;

  async exec(msg: Message) {

    const player = await Player.fromUser(msg.author);
    const lastClaim = DateTime.fromJSDate(player.doc.lastClaim.daily);
    const now = DateTime.now();
    const diff = now.diff(lastClaim, ["days"]);

    if (diff.days > 1) {
      
      player.doc.balance += this.reward;
      player.doc.lastClaim.daily = now.toJSDate();
      msg.channel.send(`Claimed daily reward! Earned ${this.reward} :taco:`);
      player.doc.save();

    } else {

      msg.channel.send(`You already claimed for today`);
  
    }
  }
}
