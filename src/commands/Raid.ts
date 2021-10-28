import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { DungeonChallenger } from "../structure/Challenger";
import { bold, toNList, validateIndex, validateNumber } from "../utils";
import { ButtonHandler } from "../structure/ButtonHandler";
import { Player } from "../structure/Player";
import { Battle } from "discordjs-rpg";
import { oneLine } from "common-tags";

export default class extends Command {
  name = "raid";
  max = 4;
  block = true;
  timeout = 20; // seconds

  async exec(msg: Message, args: string[]) {

    try {

      const [arg1] = args;

      if (arg1) {

        const index = parseInt(arg1) - 1;

        validateNumber(index);
        validateIndex(index, DungeonChallenger.all);

        const boss = DungeonChallenger.all[index];

        const menu = new ButtonHandler(msg, boss.show());

        menu.addButton("start raid", async () => {

          const menu = new ButtonHandler(msg, 
            oneLine`Starting a raid against ${boss.name}. ${this.max} players
            max. Starting in ${this.timeout}s`
          )
            .setMultiUser(this.max)
            .setTimeout(this.timeout * 1000);

          const players: Player[] = [];

          menu.addButton("join", async (user) => {
            const player = await Player.fromUser(user!);

            if (player.doc.level < boss.minLevel) {
              msg.channel.send(`${player.name} does not minimum level requirement`);
              return;
            }

            if (players.some(x => x.id === player.id)) {
              msg.channel.send(`${player.name} already joined the raid!`);
              return;
            }

            players.push(player);
            msg.channel.send(`${user!.username} joined the raid!`);
          })

          menu.addButton("cancel", (user) => {
            if (user!.id !== msg.author.id) {
              msg.channel.send(`Only ${msg.author.username} can cancel the raid`);
            } else {
              throw new Error("raid cancelled");
            }
          })

          await menu.run();

          const battle = new Battle(msg, [...players, boss]);

          battle.setBoss(boss);

          const winner = await battle.run();

          if (winner.id === boss.id) {

            msg.channel.send("Mission failed");

          } else {

            msg.channel.send(`${boss.name} has been successfully defeated!`);
            const { xpDrop, drop } = boss;

            for (const player of players) {

              player.addXPandShow(msg, xpDrop);
              player.addBalanceAndShow(msg, drop);

            }
          }

        })

        menu.addCloseButton();
        await menu.run();

        return;
      }

      const bosses = toNList(DungeonChallenger.all
        .map(x => `${x.name} | Min Level: ${bold(x.minLevel)}`));

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Boss")
        .setDescription(bosses)

      msg.channel.send({ embeds: [embed] });

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
