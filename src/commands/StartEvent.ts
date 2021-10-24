import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { BattleRoyale } from "../db/BattleRoyale";
import { Player } from "../structure/Player";
import { random, sleep } from "../utils";
import { adminID, devID } from "../index";

export default class extends Command {
  name = "start-event";
  description = "start Battle Royale event"
  disable = true;

  async exec(msg: Message) {

    try {

      const authorID = msg.author.id;

      if (authorID !== adminID && authorID !== devID) {
        throw new Error("only admins can use this command");
      }

      const battleRoyale = await BattleRoyale.getMain();
      let participants = battleRoyale.participantsID;

      if (participants.length < 2) {
        throw new Error("cannot start Battle Royale with below 2 participants");
      }

      await msg.channel.send("Battle Royale is starting...");

      while (participants.length > 1) {
        await sleep(1000);

        const loser = random.pick(participants);
        const user = await msg.client.users.fetch(loser);

        participants = participants.filter(x => x !== loser);
        msg.channel.send(`${user.username} died!`);
      }

      const winner = participants[0];

      const user = await msg.client.users.fetch(winner);
      const player = await Player.fromUser(user);

      player.doc.balance += battleRoyale.prize;

      await msg.channel.send(`${player.name} wins Battle Royale!`);
      await msg.channel.send(`${player.name} earns ${battleRoyale.prize} :taco:`);

      battleRoyale.status = "inactive";
      battleRoyale.participantsID = [];
      await battleRoyale.save();


    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
