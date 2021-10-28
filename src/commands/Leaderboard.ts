import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { User } from "../db/User";
import { Player } from "../structure/Player";
import { bold, currency } from "../utils";

export default class Leaderboard extends Command {
  name = "leaderboard";
  aliases = ["l", "lb"];
  description = "leaderboard of tuesday tacos players";

  async exec(msg: Message) {


    const userDocs = await User.find().sort({ level: -1 }).limit(10);
    const users = await Promise.all(userDocs.map(x => msg.client.users.fetch(x.userID)));
    const players: Player[] = users.filter(x => !!x).map(user => {
      const userDoc = userDocs.find(x => x.userID === user!.id)!;
      return new Player(user, userDoc);
    })

    const list = players
      .map((x, i) => `${i + 1}. ${x.name} | Level ${bold(x.doc.level)} | ${bold(x.netWorth())} ${currency}`)
      .join("\n");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Leaderboard")
      .setDescription(list)

    msg.channel.send({ embeds: [embed] });
  }
}
