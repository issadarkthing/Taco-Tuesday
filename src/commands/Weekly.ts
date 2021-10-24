import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { DateTime } from "luxon";

export default class extends Command {
  name = "weekly";
  description = "claim weekly taco";
  reward = 400;

  async exec(msg: Message) {

    const player = await Player.fromUser(msg.author);
    const lastClaim = DateTime.fromJSDate(player.doc.lastClaim.weekly);
    const now = DateTime.now();
    const diff = now.diff(lastClaim, ["weeks"]);

    if (diff.weeks > 1) {
      
      player.doc.balance += this.reward;
      player.doc.lastClaim.weekly = now.toJSDate();
      msg.channel.send(`Claimed weekly reward! Earned ${this.reward} :taco:`);
      player.doc.save();

    } else {

      msg.channel.send(`You already claimed for this week`);
  
    }
  }
}
