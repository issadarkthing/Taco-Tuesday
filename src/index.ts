import { Client } from "discord.js";
import { CommandManager } from "@jiman24/commandment";
import path from "path";
import { config } from "dotenv";
import mongoose from "mongoose";
import { Duration } from "luxon";
import { Jackpot } from "./db/Jackpot";
import { random } from "./utils";

config();

const COMMAND_PREFIX = process.env.PREFIX || "!";
const client = new Client({ 
  intents: [
    "GUILDS", 
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MEMBERS",
  ],
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "REACTION",
  ]
});

export const commandManager = new CommandManager(COMMAND_PREFIX);
export const adminID = "117796576067321865";
export const devID = "264010327023288323";

commandManager.verbose = true;
commandManager.registerCommands(path.resolve(__dirname, "./commands"));

commandManager.registerCommandNotFoundHandler((msg, cmdName) => {
  msg.channel.send(`Cannot find command "${cmdName}"`);
})

commandManager.registerCommandOnThrottleHandler((msg, cmd, timeLeft) => {
  const time = (timeLeft / 1000).toFixed(2);
  msg.channel.send(`You cannot run ${cmd.name} command after ${time} s`);
})

client.on("ready", () => console.log(client.user?.username, "is ready!"))
client.on("messageCreate", msg => commandManager.handleMessage(msg));

client.login(process.env.BOT_TOKEN);
mongoose.connect(process.env.DB_URI!)
  .then(() => { 

    console.log("connected to db!");

    setInterval(async () => {

      const jackpot = await Jackpot.getMain();
      jackpot.amount = random.integer(100, 10_000);
      await jackpot.save();

    }, Duration.fromObject({ minutes: 1 }).as("milliseconds"));

  });
