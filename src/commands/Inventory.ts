import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { ButtonHandler } from "../structure/ButtonHandler";
import { Player } from "../structure/Player";
import { remove, toNList, validateNumber } from "../utils";

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

        const menu = new ButtonHandler(msg, item.show());

        menu.addButton("equip", () => {

          player.doc.equippedArmors.push(item.id);
          player.doc.armors = remove(item.id, player.doc.armors);
          player.doc.save();

          msg.channel.send(`Successfully equipped ${item.name}`);

        })

        menu.addCloseButton();
        await menu.run();

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
