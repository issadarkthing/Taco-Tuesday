import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class Tacos extends Command {
  name = "tacos";

  async exec(msg: Message) {

    const mentionedUser = msg.mentions.users.first();

    if (mentionedUser) {

      const mentionedPlayer = await Player.fromUser(mentionedUser);
      msg.channel.send(
        `${mentionedPlayer.name} has ${mentionedPlayer.user.balance} :taco:`
      );

      return;
    }

    const player = await Player.fromUser(msg.author);
    msg.channel.send(`${player.name} has ${player.user.balance} :taco:`);
  }
}
