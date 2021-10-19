import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";

export default class Marry extends Command {
  name = "marry";
  description = "pay a price and marry a player";

  async exec(msg: Message) {

    try {

      const player = await Player.fromUser(msg.author);

      if (player.user.spouse.userID !== undefined) {
        throw new Error(`you already married to ${player.user.spouse.name}!`);
      }

      const mentionedUser = msg.mentions.users.first();

      if (!mentionedUser) {
        throw new Error(`you need to mention a user`);
      }

      const mentionedPlayer = await Player.fromUser(mentionedUser);

      if (mentionedPlayer.user.spouse.userID !== undefined) {
        throw new Error(`${mentionedPlayer.name} is already married`);

      } else if (mentionedPlayer.user.userID === player.user.userID) {
        throw new Error(`You cannot marry yourself`);

      } else if (player.user.balance < mentionedPlayer.user.price) {
        throw new Error(`Insufficient balance`);
      }


      player.user.balance -= mentionedPlayer.user.price;
      player.user.spouse.userID = mentionedPlayer.user.userID;
      player.user.spouse.name = mentionedPlayer.name;

      mentionedPlayer.user.balance += mentionedPlayer.user.price;
      mentionedPlayer.user.spouse.userID = player.user.userID;
      mentionedPlayer.user.spouse.name = player.name;

      player.user.save();
      mentionedPlayer.user.save();

      msg.channel.send(`Successfully married to ${mentionedPlayer.name}!`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
