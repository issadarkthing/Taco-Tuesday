import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { adminID, devID } from "../index";
import { User } from "../db/User";

export default class extends Command {
  name = "reset";
  description = "resets everyone tacos";

  async exec(msg: Message) {

    try {

      const authorID = msg.author.id;

      if (authorID !== adminID && authorID !== devID) {
        throw new Error("only admins can use this command");
      }

      const users = await User.find();

      for (const user of users) {
        user.balance = 0;
        user.bank = 1000;
        await user.save();
      }

      msg.channel.send(`Successfully cancelled Battle Royale event`);

    } catch (err) {
      msg.channel.send((err as Error).message);
    }
  }
}
