import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { DungeonChallenger } from "../structure/Challenger";
import { toNList, validateIndex, validateNumber } from "../utils";
import { ButtonHandler } from "../structure/ButtonHandler";
import { Player } from "../structure/Player";
import { Battle } from "discordjs-rpg";

export default class extends Command {
  name = "raid";

  async exec(msg: Message, args: string[]) {

    try {

      const [arg1] = args;

      if (arg1) {

        const index = parseInt(arg1) - 1;

        validateNumber(index);
        validateIndex(index, DungeonChallenger.all);

        const boss = DungeonChallenger.all[index];

        const menu = new ButtonHandler(msg, boss.show())
          .setMultiUser(2)
          .setTimeout(20_000);

        const players: Player[] = [];

        menu.addButton("join", async (user) => {
          const player = await Player.fromUser(user!);
          players.push(player);
          msg.channel.send(`${user!.username} joined the raid!`);
        })

        await menu.run();

        const battle = new Battle(msg, [...players, boss]);

        battle.setBoss(boss);

        await battle.run();

        return;
      }

      const bosses = toNList(DungeonChallenger.all.map(x => x.name));

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
