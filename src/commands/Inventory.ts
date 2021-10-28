import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { BaseArmor } from "../structure/Armor";
import { ButtonHandler } from "../structure/ButtonHandler";
import { BasePet } from "../structure/Pet";
import { Player } from "../structure/Player";
import { BaseWeapon } from "../structure/Weapon";
import { remove, toNList, validateNumber } from "../utils";

export default class extends Command {
  name = "inventory";
  description = "show player's inventory";
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

        if (item instanceof BaseArmor) {

          if (player.armors.some(x => x.id === item.id)) {
            
            menu.addButton("unequip", () => {

              player.doc.equippedArmors = remove(item.id, player.doc.equippedArmors);
              player.doc.armors.push(item.id);
              player.doc.save();

              msg.channel.send(`Successfully unequipped ${item.name}`);
            })

          } else {

            menu.addButton("equip", () => {

              player.doc.equippedArmors.push(item.id);
              player.doc.armors = remove(item.id, player.doc.armors);
              player.doc.save();

              msg.channel.send(`Successfully equipped ${item.name}`);

            })
          }


        } else if (item instanceof BaseWeapon) {

          if (player.weapons.some(x => x.id === item.id)) {
            
            menu.addButton("unequip", () => {

              player.doc.equippedWeapons = remove(item.id, player.doc.equippedWeapons);
              player.doc.weapons.push(item.id);
              player.doc.save();

              msg.channel.send(`Successfully unequipped ${item.name}`);
            })

          } else {

            menu.addButton("equip", () => {

              player.doc.equippedWeapons.push(item.id);
              player.doc.weapons = remove(item.id, player.doc.weapons);
              player.doc.save();

              msg.channel.send(`Successfully equipped ${item.name}`);

            })
          }

        } else if (item instanceof BasePet) {

          if (player.activePet?.id === item.id) {

            menu.addButton("deactivate", () => {

              player.doc.activePet = undefined;
              player.doc.save();

              msg.channel.send(`Successfully deactive ${item.name}`);
            })

          } else {

            menu.addButton("activate", () => {

              player.doc.activePet = item.id;
              player.doc.save();

              msg.channel.send(`Successfully make ${item.name} as active pet`);

            })
          }

        }


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
