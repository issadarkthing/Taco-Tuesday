import { Message } from "discord.js";
import { Weapon } from "discordjs-rpg";
import { Player } from "../structure/Player";

export abstract class BaseWeapon extends Weapon {
  abstract price: number;

  static get all(): BaseWeapon[] {
    return [
      new Axe(),
      new Sword(),
      new Dagger(),
      new Mace(),
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
      player.weapons.some(x => x.id === this.id)
    ) {
      msg.channel.send("You already own this item");
      return;
    }

    player.doc.balance -= this.price;
    player.doc.weapons.push(this.id);

    await player.doc.save();
    msg.channel.send(`Successfully bought **${this.name}**`);
  }
}


class Axe extends BaseWeapon {
  id = "axe";
  name = "Axe";
  attack = 20;
  price = 1000;
}

class Sword extends BaseWeapon {
  id = "sword";
  name = "Sword";
  attack = 30;
  price = 2000;
}

class Dagger extends BaseWeapon {
  id = "dagger";
  name = "Dagger";
  attack = 40;
  price = 3000;
}

class Mace extends BaseWeapon {
  id = "mace";
  name = "Mace";
  attack = 45;
  price = 3500;
}
