import { Message } from "discord.js";
import { Pet } from "discordjs-rpg";
import { Player } from "./Player";

export abstract class BasePet extends Pet {
  abstract price: number;

  static get all(): BasePet[] {
    return [
      new Blob(),
      new Slime(),
      new Phoenix(),
      new Titanoboa(),
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
      player.armors.some(x => x.id === this.id)
    ) {
      msg.channel.send("You already own this item");
      return;
    }

    player.doc.balance -= this.price;
    player.doc.pets.push(this.id);

    await player.doc.save();
    msg.channel.send(`Successfully bought **${this.name}**!`);
  }
}

export class Blob extends BasePet {
  name = "Blob";
  id = "blob";
  attack = 20;
  price = 13000;
}

export class Slime extends BasePet {
  name = "Slime";
  id = "slime";
  attack = 15;
  interceptRate = 0.2;
  price = 15000;
}

export class Phoenix extends BasePet {
  name = "Phoenix";
  id = "phoenix";
  attack = 15;
  interceptRate = 0.2;
  price = 15000;
}

export class Titanoboa extends BasePet {
  name = "Titan O Boa";
  id = "titan-o-boa";
  attack = 5;
  interceptRate = 0.4;
  price = 30000;
}
