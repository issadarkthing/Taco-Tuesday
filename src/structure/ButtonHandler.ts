import {
  Message,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageComponentInteraction,
  User,
  MessageActionRowComponent,
  InteractionCollector,
} from "discord.js";
import crypto from "crypto";

interface Button {
  id: string;
  label: string;
  callback: (user?: User, id?: string) => void | Promise<void>;
}

type ButtonCallback = Button["callback"];

const GLOBAL_BUTTONS: Button[] = [];

export class ButtonHandler {
  private msg: Message;
  private userID: string;
  private embed: MessageEmbed;
  private buttons: Button[] = [];
  private timeout = 60_000;
  private maxUser = 1;
  private max = 1;
  private id = this.uuid();
  private collector?: InteractionCollector<MessageComponentInteraction>;

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

  private uuid() {
    return crypto.randomBytes(16).toString("hex");
  }

  private labelToID(label: string) {
    return `${this.id}-` + label.replace(/\s+/, "") + `-${this.uuid()}`;
  }

  private getButtonHandlerID(id: string) {
    return id.split("-")[0];
  }

  private isMultiUser() {
    return this.maxUser !== 1;
  }

  setMultiUser(max: number) {
    this.maxUser = max;
    return this;
  }

  setTimeout(ms: number) {
    this.timeout = ms;
    return this;
  }

  /** set max click (only for single user only!) */
  setMax(max: number) {
    this.max = max;
    return this;
  }

  addButton(label: string, callback: ButtonCallback) {
    const id = this.labelToID(label);
    const button = {
      id,
      label,
      callback,
    }

    this.buttons.push(button);
    GLOBAL_BUTTONS.push(button);

    return this;
  }

  addCloseButton() {
    const label = "cancel";
    const id = this.labelToID(label);
    const button = {
      id,
      label,
      callback: () => {},
    }

    this.buttons.push(button);
    GLOBAL_BUTTONS.push(button);

    return this;
  }

  close() {
    this.collector?.emit("end");
  }

  async run() {
    const buttons = this.buttons.map((x) => {

      const btn = new MessageButton()
        .setCustomId(x.id)
        .setLabel(x.label)
        .setStyle("PRIMARY");

      if (x.id.includes("cancel")) {
        btn.setStyle("DANGER");
      }

      return btn
    });

    const row = new MessageActionRow().addComponents(buttons);
    const menu = await this.msg.channel
      .send({ embeds: [this.embed], components: [row] });

    const filter = (i: MessageComponentInteraction) => {
      i.deferUpdate().catch(() => {});

      if (this.isMultiUser()) return true;

      return i.user.id === this.userID;
    };

    const collector = this.msg.channel.createMessageComponentCollector({
      max: this.isMultiUser() ? this.maxUser : this.max,
      filter,
      time: this.timeout,
    });

    this.collector = collector;

    return new Promise<void>((resolve, reject) => {

      const promises: Promise<void>[] = [];

      collector.on("collect", async button => {
        let btn = this.buttons.find(x => x.id === button.customId);

        if (!btn) {
          btn = GLOBAL_BUTTONS.find(x => {
            const btnHandlerID = this.getButtonHandlerID(x.id);
            return btnHandlerID === this.id && x.id === button.customId
          });
        } 

        if (btn) {
          
          try {

            const promise = btn.callback(button.user, button.customId);

            if (promise) promises.push(promise);

          } catch (err) {
            collector.emit("end");
            reject(err);
          }
        }

      })

      collector.on("end", () => {
        menu.delete();

        for (const button of this.buttons) {
          const index = GLOBAL_BUTTONS.findIndex(x => x.id === button.id);
          GLOBAL_BUTTONS.splice(index, 1);
        }

        Promise.allSettled(promises)
          .then(() => resolve())
          .catch(err => reject(err));
      });
    });
  }
}
