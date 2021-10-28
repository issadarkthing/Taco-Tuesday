import { Message, MessageEmbed } from "discord.js";
import { currency, inlineCode, toNList } from "../utils";
import { BaseArmor } from "../structure/Armor";
import { Command } from "@jiman24/commandment";
import { ButtonHandler } from "../structure/ButtonHandler";
import { BasePet } from "../structure/Pet";
import { BaseWeapon } from "../structure/Weapon";

export default class extends Command {
  name = "shop";
  description = "buy custom role and rpg stuff";

  async exec(msg: Message, args: string[]) {

    try {

      const items = [
        ...BaseArmor.all,
        ...BasePet.all,
        ...BaseWeapon.all,
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


      const rpgList = toNList(
        items.map(x => `${x.name} ${inlineCode(x.price)} ${currency}`)
      );

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
