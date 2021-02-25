const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const Discord = require("discord.js");
const { prefix } = require("./config.json");

const data = require("./data.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

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
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  //check if a command cannot be executed inside dm
  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("command tersebut tidak bisa dijalankan di dalam dm");
  }

  //check if a command requires args and the user didn't sent any arguments
  if (command.args && !args.length) {
    return message.channel.send(
      `kamu tidak memberikan argumen apapun, ${message.author}`
    );
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("terjadi permasalahan saat menjalankan command tersebut");
  }
});

client.login(process.env.TOKEN);
