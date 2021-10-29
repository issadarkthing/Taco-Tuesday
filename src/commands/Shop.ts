import { Message, MessageEmbed } from "discord.js";
import { currency, inlineCode, toNList, validateIndex, validateNumber } from "../utils";
import { BaseArmor } from "../structure/Armor";
import { Command } from "@jiman24/commandment";
import { ButtonHandler } from "../structure/ButtonHandler";
import { BasePet } from "../structure/Pet";
import { BaseWeapon } from "../structure/Weapon";
import { BaseSkill } from "../structure/Skill";
import { stripIndents } from "common-tags";

interface Item {
  name: string;
  price: number;
}

export default class extends Command {
  name = "shop";
  description = "buy custom role and rpg stuff";

  private toList(items: Item[], start = 1) {
    const list = toNList(
      items.map(x => `${x.name} ${inlineCode(x.price)} ${currency}`),
      start,
    );

    const lastIndex = (items.length - 1) + start;
    return [list, lastIndex] as const;
  }

  async exec(msg: Message, args: string[]) {

    try {

      const items = [
        ...BaseArmor.all,
        ...BaseWeapon.all,
        ...BasePet.all,
        ...BaseSkill.all,
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


      const [armorList, len1] = this.toList(BaseArmor.all);
      const [weaponList, len2] = this.toList(BaseWeapon.all, len1 + 1);
      const [petList, len3] = this.toList(BasePet.all, len2 + 1);
      const [skillList] = this.toList(BaseSkill.all, len3 + 1);

      const rpgList = stripIndents`
      **Armor**
      ${armorList}

      **Weapon**
      ${weaponList}

      **Pet**
      ${petList}

      **Skill**
      ${skillList}
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
