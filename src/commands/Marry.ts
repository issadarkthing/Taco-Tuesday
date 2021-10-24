import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { ReactionCollector } from "discord-collector";
import { oneLine } from "common-tags";

export default class Marry extends Command {
  name = "marry";
  description = "pay a price and marry a player";
  disable = true;

  async exec(msg: Message) {

    try {

      const player = await Player.fromUser(msg.author);

      if (player.doc.spouse.userID !== undefined) {
        throw new Error(`you already married to ${player.doc.spouse.name}!`);
      }

      const mentionedUser = msg.mentions.users.first();

      if (!mentionedUser) {
        throw new Error(`you need to mention a user`);
      }

      const mentionedPlayer = await Player.fromUser(mentionedUser);

      if (mentionedPlayer.doc.spouse.userID !== undefined) {
        throw new Error(`${mentionedPlayer.name} is already married`);

      } else if (mentionedPlayer.doc.userID === player.doc.userID) {
        throw new Error(`You cannot marry yourself`);

      } else if (player.doc.balance < mentionedPlayer.doc.price) {
        throw new Error(`Insufficient balance`);
      }

      const botMessage = await msg.channel.send(
        oneLine`${player.name} is proposing to mary ${mentionedUser}. Do you
        want to accept or reject?`
      );

      const confirmation = await ReactionCollector.yesNoQuestion(
        { botMessage, user: mentionedUser }
      );

      if (confirmation) {
        msg.channel.send(`${mentionedPlayer.name} approved to marry`);

      } else {
        throw new Error(`${mentionedPlayer.name} rejected to marry`);

      }

      const totalBank = player.doc.bank + mentionedPlayer.doc.bank;

      player.doc.balance -= mentionedPlayer.doc.price;
      player.doc.spouse.userID = mentionedPlayer.doc.userID;
      player.doc.spouse.name = mentionedPlayer.name;
      player.doc.bank = totalBank;

      mentionedPlayer.doc.balance += mentionedPlayer.doc.price;
      mentionedPlayer.doc.spouse.userID = player.doc.userID;
      mentionedPlayer.doc.spouse.name = player.name;
      mentionedPlayer.doc.bank = totalBank;

      player.doc.save();
      mentionedPlayer.doc.save();

      msg.channel.send(`Successfully married to ${mentionedPlayer.name}!`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
