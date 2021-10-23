import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { BattleRoyale } from "../db/BattleRoyale";

export default class extends Command {
  name = "join-battle";
  description = "join Battle Royale event";
  disable = true;

  async exec(msg: Message) {

    try {

      const battleRoyale = await BattleRoyale.getMain();

      if (battleRoyale.status === "inactive") {
        throw new Error("There is no Battle Royale event running");
      }

      if (battleRoyale.participantsID.includes(msg.author.id)) {
        throw new Error("You already joined Battle Royale Event");
      }

      battleRoyale.participantsID.push(msg.author.id);

      await battleRoyale.save();

      msg.channel.send(`${msg.author.username} joined Battle Royale event!`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
