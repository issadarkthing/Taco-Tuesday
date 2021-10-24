import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { toNList } from "../utils";

export default class extends Command {
  name = "inventory";
  aliases = ["i"];

  async exec(msg: Message) {

    const player = await Player.fromUser(msg.author);
    const inventoryList = toNList(player.doc.armors.map(x => x.name));

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Inventory")
      .setDescription(inventoryList);

    msg.channel.send({ embeds: [embed] });
  }
}
