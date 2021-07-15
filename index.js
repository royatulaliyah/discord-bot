const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const Discord = require("discord.js");
const { prefix } = require("./config.json");

const data = require("./data.json");
const { Fess } = require("./db");

const client = new Discord.Client();
require("discord-buttons")(client);
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.once("ready", () => {
  Fess.sync();
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // split messages to arguments
  var regexp = /[^\s"]+|"([^"]*)"/gi;
  var raw = message.content.slice(prefix.length).trim();
  var args = [];
  do {
    var match = regexp.exec(raw);
    if (match != null) {
      args.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  //check if a command cannot be executed inside dm
  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("command tersebut tidak bisa dijalankan di dalam dm");
  }

  //check if a command can only be executed inside dm
  if (command.dmOnly && message.channel.type !== "dm") {
    return message.reply("command tersebut harus dijalankan di dalam dm");
  }

  //check if a command requires args and the user didn't sent any arguments
  if (command.args && !args.length) {
    return message.channel.send(
      `kamu tidak memberikan argumen apapun, ${message.author}`
    );
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `mohon tunggu ${timeLeft.toFixed(
          0
        )} detik lagi sebelum menjalankan command \`${command.name}\`.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("terjadi permasalahan saat menjalankan command tersebut");
  }
});

client.login(process.env.TOKEN);
