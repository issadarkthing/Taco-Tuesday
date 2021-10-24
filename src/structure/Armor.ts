import { Message } from "discord.js";
import { Armor } from "discordjs-rpg";
import { Player } from "../structure/Player";

export abstract class BaseArmor extends Armor {
  abstract price: number;

  static get all(): BaseArmor[] {
    return [
      new Helmet(),
      new ChestPlate(),
      new Leggings(),
      new Boots(),
    ];
  }

  async buy(msg: Message) {

    const player = await Player.fromUser(msg.author);

    if (player.doc.balance < this.price) {
      msg.channel.send("Insufficient amount");
      return;
    }

    player.doc.balance -= this.price;
    player.doc.armors.push(this);

    await player.doc.save();
    msg.channel.send(`Successfully equipped **${this.name}**`);
  }
}


export class Helmet extends BaseArmor {
  id = "helmet";
  name = "Helmet";
  price = 8500;
  armor = 0.005
}

export class ChestPlate extends BaseArmor {
  id = "chest_plate";
  name = "Chest Plate";
  price = 5000;
  armor = 0.006
}

export class Leggings extends BaseArmor {
  id = "leggings";
  name = "Leggings";
  price = 4500;
  armor = 0.008
}

export class Boots extends BaseArmor {
  id = "boots";
  name = "Boots";
  price = 5500;
  armor = 0.011
}
