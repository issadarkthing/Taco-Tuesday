import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";

export default class Gamble extends Command {
  name = "gamble";
  aliases = ["g"];

  async exec(msg: Message, args: string[]) {

    const amount = args[0];
  }
}
