import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { toNList, validateNumber } from "../utils";

export default class extends Command {
  name = "inventory";
  aliases = ["i", "inv"];

  async exec(msg: Message, args: string[]) {

    try {

      const player = await Player.fromUser(msg.author);
      const [arg1] = args;

      if (arg1) {

        const index = parseInt(arg1) - 1;

        validateNumber(index);

        const item = player.inventory[index];

        if (!item) {
          throw new Error("cannot find item");
        }

        msg.channel.send({ embeds: [item.show()] });

        return;
      }

      const inventoryList = toNList(player.inventory.map(x => x.name));

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Inventory")
        .setDescription(inventoryList);

      msg.channel.send({ embeds: [embed] });

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
