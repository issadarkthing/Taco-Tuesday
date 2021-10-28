import { Command } from "@jiman24/commandment";
import { oneLine } from "common-tags";
import { Message } from "discord.js";
import { Battle } from "discordjs-rpg";
import { ButtonHandler } from "../structure/ButtonHandler";
import { Challenger } from "../structure/Challenger";
import { Player } from "../structure/Player";
import { sleep } from "../utils";


export default class extends Command {
  name = "dungeon";
  description = "same as hunt but with party";
  max = 4;
  timeout = 20; // seconds

  async exec(msg: Message) {

    const player = await Player.fromUser(msg.author);
    const challenger = new Challenger(player);

    const menu = new ButtonHandler(msg, 
      oneLine`Starting a dungeon mode. ${this.max} players max.  Starting in
      ${this.timeout}s`
    )
      .setMultiUser(this.max)
      .setTimeout(this.timeout * 1000);

    const players: Player[] = [];

    menu.addButton("join", async (user) => {
      const player = await Player.fromUser(user!);

      if (players.some(x => x.id === player.id)) {
        msg.channel.send(`${player.name} already joined the party!`);
        return;
      }

      players.push(player);
      msg.channel.send(`${user!.username} joined the party!`);
    })

    menu.addButton("cancel", (user) => {
      if (user!.id !== msg.author.id) {
        msg.channel.send(`Only ${msg.author.username} can cancel the dungeon`);
      } else {
        throw new Error("dungeon cancelled");
      }
    })

    await menu.run();

    const info = challenger.show().setTitle("Your opponent");
    await msg.channel.send(`You encountered ${challenger.name}!`);

    const loading = await msg.channel.send({ embeds: [info] });
    await sleep(10_000);
    await loading.delete();

    const battle = new Battle(msg, [...players, challenger]);

    battle.setBoss(challenger);

    const winner = await battle.run();

    if (winner.id === challenger.id) {

      msg.channel.send("Mission failed");

    } else {

      msg.channel.send(`${challenger.name} has been successfully defeated!`);
      const { xpDrop, drop } = challenger;

      for (const player of players) {

        player.addXPandShow(msg, xpDrop);
        player.addBalanceAndShow(msg, drop);
        player.doc.save();

      }
    }
  }
}
