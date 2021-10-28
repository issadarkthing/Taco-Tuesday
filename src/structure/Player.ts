import { UserDocument, User } from "../db/User";
import { Message, User as UserDiscord } from "discord.js";
import { Player as BasePlayer } from "discordjs-rpg";
import { bold, currency, inlineCode } from "../utils";
import { BaseArmor } from "./Armor";
import { BasePet } from "./Pet";
import { BaseWeapon } from "./Weapon";

export class Player extends BasePlayer {
  doc: UserDocument;
  activePet?: BasePet;

  constructor(discordUser: UserDiscord, doc: UserDocument) {
    super(discordUser);
    this.doc = doc;

    this.armors.forEach(armor => this.equipArmor(armor));
    this.weapons.forEach(weapon => this.equipWeapon(weapon));
    this.activePet = BasePet.all.find(x => x.id === this.doc.activePet);

    this.activePet?.setOwner(this);
  }

  /** array of equipped armors */
  get armors() {
    return this.doc.equippedArmors
      .map(armorID => BaseArmor.all.find(x => x.id === armorID)!);
  }

  /** array of armors in inventory */
  get armorInventory() {
    return this.doc.armors
      .map(armorID => BaseArmor.all.find(x => x.id === armorID)!);
  }

  /** array of equipped weapons */
  get weapons() {
    return this.doc.equippedWeapons
      .map(weaponID => BaseWeapon.all.find(x => x.id === weaponID)!);
  }

  /** array of weapons in inventory */
  get weaponInventory() {
    return this.doc.weapons
      .map(weaponID => BaseWeapon.all.find(x => x.id === weaponID)!);
  }

  /** array of owned pets*/
  get pets() {
    return this.doc.pets
      .map(petID => BasePet.all.find(x => x.id === petID)!);
  }


  /** required xp to upgrade to the next level */
  private requiredXP() {
    let x = 10;
    let lvl = this.doc.level
    while (lvl > 1) {
      x += Math.round(x * 0.4);
      lvl--;
    }
    return x;
  }

  /** adds xp and upgrades level accordingly */
  addXP(amount: number) {
    this.doc.xp += amount;
    const requiredXP = this.requiredXP();

    if (this.doc.xp >= requiredXP) {
      this.doc.level++;
      this.addXP(0);
    }
  }

  addXPandShow(msg: Message, amount: number) {

    const currLevel = this.doc.level;
    this.addXP(amount);
    msg.channel.send(`${this.name} has earned ${bold(amount)} xp!`);

    if (currLevel !== this.doc.level) {
      msg.channel.send(`${this.name} is now on level ${bold(this.doc.level)}!`);
    }
  }

  addBalance(amount: number) {
    this.doc.balance += amount;
  }

  addBalanceAndShow(msg: Message, amount: number) {
    this.addBalance(amount);
    msg.channel.send(`${this.name} has earned ${bold(amount)} coins!`);
  }

  netWorth() {
    return this.doc.balance + this.doc.bank;
  }

  show() {
    
    const profile = super.show();

    profile.addField("Balance", `${this.doc.balance} ${currency}`, true);
    profile.addField("Bank", `${this.doc.bank} ${currency}`, true);
    profile.addField("Level", inlineCode(this.doc.level), true);
    profile.addField("XP", `\`${this.doc.xp}/${this.requiredXP()}\``, true);

    return profile;
  }

  get inventory() {
    return [
      ...this.armors,
      ...this.armorInventory,
      ...this.weapons,
      ...this.weaponInventory,
      ...this.pets,
    ];
  }

  static async fromUser(user: UserDiscord) {
 
    let dbUser = await User.findByUserID(user.id);

    if (!dbUser) {
      dbUser = new User({ userID: user.id });
      await dbUser.save();
    }

    const player = new Player(user, dbUser);

    return player;
  }
}
