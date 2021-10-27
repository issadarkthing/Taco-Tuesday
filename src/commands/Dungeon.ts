import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { ButtonHandler } from "../structure/ButtonHandler";

export default class extends Command {
  name = "dungeon";

  async exec(msg: Message) {

    const menu = new ButtonHandler(msg, "This is sample");

    menu.setMultiUser();

    menu.addButton("join", (id, user) => {
      msg.channel.send(`${user} clicked ${id}!`);
    })

    menu.run();
  }
}
