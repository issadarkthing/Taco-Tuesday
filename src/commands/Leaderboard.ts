import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { User } from "../db/User";
import { Player } from "../structure/Player";

export default class Leaderboard extends Command {
  name = "leaderboard";
  aliases = ["l", "lb"];
  description = "leaderboard of tuesday tacos players";

  async exec(msg: Message) {


    const userDocs = await User.find();
    const players: Player[] = [];

    for (const userDoc of userDocs) {

      const user = await msg.client.users.fetch(userDoc.userID);

      if (user) {
        players.push(new Player(user, userDoc));
      }
    }
    
    players.sort((a, b) => b.doc.balance - a.doc.balance);

    const list = players
      .map((x, i) => `${i + 1}. ${x.name} ${x.doc.balance} :taco:`)
      .join("\n");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Leaderboard")
      .setDescription(list)

    msg.channel.send({ embeds: [embed] });
  }
}
