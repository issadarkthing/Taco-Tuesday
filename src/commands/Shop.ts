import { Message, MessageEmbed } from "discord.js";
import { currency, inlineCode, toNList, validateIndex, validateNumber } from "../utils";
import { BaseArmor } from "../structure/Armor";
import { Command } from "@jiman24/commandment";
import { ButtonHandler } from "../structure/ButtonHandler";
import { BasePet } from "../structure/Pet";
import { BaseWeapon } from "../structure/Weapon";
import { stripIndents } from "common-tags";

interface Item {
  name: string;
  price: number;
}

export default class extends Command {
  name = "shop";
  description = "buy custom role and rpg stuff";

  private toList(items: Item[], start = 1) {
    return toNList(
      items.map(x => `${x.name} ${inlineCode(x.price)} ${currency}`),
      start,
    );
  }

  async exec(msg: Message, args: string[]) {

    try {

      const items = [
        ...BaseArmor.all,
        ...BaseWeapon.all,
        ...BasePet.all,
      ];
      const [arg1] = args;


      if (arg1) {

        const index = parseInt(arg1) - 1;

        validateNumber(index);
        validateIndex(index, items);

        const selected = items[index];

        const info = selected.show();
        const menu = new ButtonHandler(msg, info);

        menu.addButton("buy", () => {
          return selected.buy(msg);
        })

        menu.addCloseButton();

        await menu.run();

        return;
      }


      const armorList = this.toList(BaseArmor.all);
      const weaponList = this.toList(BaseWeapon.all, BaseArmor.all.length + 1);
      const petList = this.toList(
        BasePet.all, 
        BaseWeapon.all.length + BaseArmor.all.length + 1,
      );

      const rpgList = stripIndents`
      **Armor**
      ${armorList}

      **Weapon**
      ${weaponList}

      **Pet**
      ${petList}
      `;

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
