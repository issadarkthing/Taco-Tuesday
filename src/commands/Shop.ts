import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { currency, toNList } from "../utils";
import { BaseArmor } from "../structure/Armor";
import { Command } from "@jiman24/commandment";
import { ButtonHandler } from "../structure/ButtonHandler";


export default class extends Command {
  name = "shop";
  description = "buy custom role and rpg stuff";

  async exec(msg: Message, args: string[]) {

    try {

      const items = [
        ...BaseArmor.all,
      ];
      const rpgs = [
        ...BaseArmor.all,
      ];
      const [index] = args;


      if (index) {

        const selected = items.at(parseInt(index) - 1);

        if (!selected) {
          throw new Error("no item found");
        }

        const info = selected.show();
        const menu = new ButtonHandler(msg, info);

        menu.addButton("buy", () => {
          return selected.buy(msg);
        })

        menu.addCloseButton();

        await menu.run();

        return;
      }


      const rpgList = toNList(rpgs.map(x => `${x.name} \`${x.price}\` ${currency}`));

      const shop = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Shop")
        .setDescription(rpgList);

      msg.channel.send({ embeds: [shop] });

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
