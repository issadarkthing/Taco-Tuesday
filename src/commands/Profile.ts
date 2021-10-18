import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class Profile extends Command {
  name = "profile";
  aliases = ["p"];
  description = "show player's profile";

  async exec(msg: Message) {

    const player = await Player.fromUser(msg.author);

    msg.channel.send({ embeds: [player.show()] });
  }
}
