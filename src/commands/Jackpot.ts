import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Jackpot } from "../db/Jackpot";

export default class extends Command {
  name = "jackpot";
  description = "show current jackpot";
  disable = true;

  async exec(msg: Message) {

    const jackpot = await Jackpot.getMain();

    msg.channel.send(`Current jackpot is ${jackpot.amount} :taco:`);

  }
}
