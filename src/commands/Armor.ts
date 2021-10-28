import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { ButtonHandler } from "../structure/ButtonHandler";
import { Player } from "../structure/Player";
import { remove, toNList, validateNumber } from "../utils";


export default class extends Command {
  name = "armor";
  disable = true;

  async exec(msg: Message, args: string[]) {

    const player = await Player.fromUser(msg.author);
    const armors = player.armors;
    const [arg1] = args;
    
    if (arg1) {

      const index = parseInt(arg1) - 1;

      validateNumber(index);
      
      const armor = armors[index];

      if (!armor) throw new Error("cannot find armor");

      const menu = new ButtonHandler(msg, armor.show());

      menu.addButton("unequip", () => {

        player.doc.equippedArmors = remove(armor.id, player.doc.equippedArmors);
        player.doc.armors.push(armor.id);
        player.doc.save();

        msg.channel.send(`Successfully unequipped ${armor.name}`);

      });

      menu.addCloseButton();

      await menu.run();

      return;
    }

    const armorList = toNList(armors.map(x => x.name));

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Equipped Armors")
      .setDescription(armorList);

    msg.channel.send({ embeds: [embed] });
  }
}
