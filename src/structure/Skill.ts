import { Fighter, Skill } from "discordjs-rpg";
import { Message, MessageEmbed } from "discord.js";
import { oneLine } from "common-tags";
import { inlineCode } from "../utils";
import { Player } from "./Player";

export abstract class BaseSkill extends Skill {
  abstract price: number;

  static get all(): BaseSkill[] {
    return [
      new Rage(),
      new Heal(),
    ];
  }

  async buy(msg: Message) {

    const player = await Player.fromUser(msg.author);

    if (player.doc.balance < this.price) {
      msg.channel.send("Insufficient amount");
      return;
    }

    if (
      player.inventory.some(x => x.id === this.id) ||
      player.skills.some(x => x.id === this.id)
    ) {
      msg.channel.send("You already own this skill");
      return;
    }

    player.doc.balance -= this.price;
    player.doc.skills.push(this.id);

    await player.doc.save();
    msg.channel.send(`Successfully bought **${this.name}**`);
  }
}

class Rage extends BaseSkill {
  name = "Rage";
  id = "rage";
  description = "Does double damage when activated temporarily";
  price = 45_000;

  use(p1: Fighter, _p2: Fighter) {

    p1.attack *= 2;

    const embed = new MessageEmbed()
      .setTitle("Skill interception")
      .setColor("GREEN")
      .setDescription(
        oneLine`${p1.name} uses **${this.name} Skill** and increases their
        strength to ${inlineCode(p1.attack)}!`
      )

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }

  close(p1: Fighter, _p2: Fighter) {
    p1.attack /= 2;
  }
}

class Heal extends BaseSkill {
  name = "Heal";
  id = "heal";
  description = "Heals 20% of hp when activated";
  price = 55_000;
  interceptRate = 0.1;

  use(p1: Fighter, _p2: Fighter) {

    const healAmount = Math.ceil(p1.hp * 0.2);
    p1.hp += healAmount;

    const embed = new MessageEmbed()
      .setTitle("Skill interception")
      .setColor("GREEN")
      .setDescription(
        oneLine`${p1.name} uses **${this.name} Skill** and heals
        ${inlineCode(healAmount)}hp !`
      )

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }

  close(_p1: Fighter, _p2: Fighter) {}
}
