import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { BattleRoyale } from "../db/BattleRoyale";
import { adminID, devID } from "../index";
import { validateNumber } from "../utils";

export default class extends Command {
  name = "create-event";
  description = "creates Battle Royale event";

  async exec(msg: Message, args: string[]) {

    try {

      const authorID = msg.author.id;

      if (authorID !== adminID && authorID !== devID) {
        throw new Error("only admins can use this command");
      }

      const amount = parseInt(args[0]);
      validateNumber(amount);

      const battleRoyale = await BattleRoyale.getMain();

      battleRoyale.participantsID = [];
      battleRoyale.prize = amount;
      battleRoyale.status = "active";

      await battleRoyale.save();

      msg.channel.send("Starting new battle royale event");

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
