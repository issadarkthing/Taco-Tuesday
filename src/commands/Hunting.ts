import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Battle } from "discordjs-rpg";
import { Challenger } from "../structure/Challenger";
import { Player } from "../structure/Player";
import { sleep } from "../utils";


export default class extends Command {
  name = "hunt";
  description = "fight monsters and level up";

  async exec(msg: Message) {

    try {

      const player = await Player.fromUser(msg.author);
      const challenger = new Challenger(player);

      const info = challenger.show().setTitle("Your opponent");

      await msg.channel.send(`You encountered ${challenger.name} while hunting!`);
      const loading = await msg.channel.send({ embeds: [info] });
      await sleep(10_000);
      await loading.delete();

      const battle = new Battle(msg, [player, challenger]);
      const winner = await battle.run();

      if (winner.id === player.id) {

        player.addXPandShow(msg, challenger.xpDrop);
        player.addBalanceAndShow(msg, challenger.drop);
        await player.doc.save();

      } 

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
