import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { currency, toNList } from "../utils";
import { BaseArmor } from "../structure/Armor";
import { Command } from "@jiman24/commandment";


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

        const button = new MessageButton()
          .setCustomId("buy")
          .setLabel("buy")
          .setStyle("PRIMARY");

        const row = new MessageActionRow()
          .addComponents(button);

        msg.channel.send({ embeds: [info], components: [row] });

        const filter = (i: MessageComponentInteraction) => {
          i.deferUpdate().catch(() => {});
          return i.user.id === msg.author.id;
        }

        const collector = msg.channel.createMessageComponentCollector({ max: 1, filter });

        collector.on("end", buttons => {
          const button = buttons.first();

          if (!button) return;

          selected.buy(msg);
        })

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
