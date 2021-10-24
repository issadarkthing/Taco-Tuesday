import {
  Message,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageComponentInteraction,
} from "discord.js";

interface Button {
  id: string;
  label: string;
  callback: (id?: string) => void | Promise<void>;
}

export class ButtonHandler {
  private msg: Message;
  private userID: string;
  private embed: MessageEmbed;
  private buttons: Button[] = [];

  constructor(msg: Message, embed: MessageEmbed | string, userID?: string) {
    this.msg = msg;
    this.userID = userID || msg.author.id;
    this.embed = new MessageEmbed();

    if (embed instanceof MessageEmbed) {
      this.embed = new MessageEmbed(embed);
    } else if (typeof embed === "string") {
      const newEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(embed);

      this.embed = newEmbed;
    }
  }

  private labelToID(label: string) {
    return label.replace(/\s+/, "-");
  }

  addButton(label: string, callback: (emoji?: string) => void | Promise<void>) {
    this.buttons.push({
      id: this.labelToID(label),
      label,
      callback,
    });
    return this;
  }

  addCloseButton() {
    const label = "cancel";

    this.buttons.push({
      id: this.labelToID(label),
      label,
      callback: () => {},
    });
  }

  async run() {
    const buttons = this.buttons.map((x) => {

      const btn = new MessageButton()
        .setCustomId(x.id)
        .setLabel(x.label)
        .setStyle("PRIMARY");

      if (x.id === "cancel") {
        btn.setStyle("DANGER");
      }

      return btn
    });

    const row = new MessageActionRow().addComponents(buttons);
    const menu = await this.msg.channel
      .send({ embeds: [this.embed], components: [row] });

    const filter = (i: MessageComponentInteraction) => {
      i.deferUpdate().catch(() => {});
      return i.user.id === this.userID;
    };

    const collector = this.msg.channel.createMessageComponentCollector({
      max: 1,
      filter,
    });

    return new Promise<void>((resolve) => {
      collector.on("end", async (buttons) => {
        const button = buttons.first();
        menu.delete();

        if (!button) return;

        const btn = this.buttons.find((x) => x.id === button.customId)!;

        await btn.callback();
        resolve();
      });
    });
  }
}
