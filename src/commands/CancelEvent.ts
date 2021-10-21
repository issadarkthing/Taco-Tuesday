import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { BattleRoyale } from "../db/BattleRoyale";
import { adminID, devID } from "../index";

export default class extends Command {
  name = "cancel-event";
  description = "cancel Battle Royale event";

  async exec(msg: Message) {

    try {

      const authorID = msg.author.id;

      if (authorID !== adminID && authorID !== devID) {
        throw new Error("only admins can use this command");
      }

      const battleRoyale = await BattleRoyale.getMain();

      if (battleRoyale.status === "inactive") {
        throw new Error("There is no Battle Royale event running");
      }

      battleRoyale.participantsID = [];
      battleRoyale.status = "inactive";

      await battleRoyale.save();

      msg.channel.send(`Successfully cancelled Battle Royale event`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
