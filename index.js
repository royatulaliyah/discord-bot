const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const Discord = require("discord.js");
const { prefix } = require("./config.json");

const data = require("./data.json");
const { Fess } = require("./db");

const client = new Discord.Client();
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

  const cron = require("node-cron");
  const https = require("https");
  const channel = client.channels.cache.get("860202798813413407");

  cron.schedule("*/1 * * * *", function () {
    channel.bulkDelete(99);
    channel.send("fetching API every minute...");
    channel.send("getting schedules...").then((sent) => {
      let message = "";

      try {
        https.get("https://api.indonesiabangkit.com/api/v1/waktu", (res) => {
          res.on("data", (chunk) => {
            let data = JSON.parse(chunk);
            let start = new Date(data.data.start);
            let end = new Date(data.data.end);

            message += `${start.getDate()} ${start.toLocaleString("default", {
              month: "long",
            })} - ${end.getDate()} ${end.toLocaleString("default", {
              month: "long",
            })}`;

            const endpoint =
              "https://api.indonesiabangkit.com/api/v1/sesi?tanggal=2021-";

            let days = [];
            for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
              days.push(new Date(d));
            }

            for (let i = 0; i < days.length; i++) {
              channel.send("getting quotas...").then((sent2) => {
                const url = `${endpoint}${days[i].getMonth()}-${days[
                  i
                ].getDate()}`;
                console.log(url);
                https.get(url, (resp) => {
                  resp.on("data", (chunk2) => {
                    const parsed = JSON.parse(chunk2);
                    console.log(parsed);

                    if (parsed.total > 0) {
                      channel.send("found! <@487959385939771392>");
                    } else {
                      sent2.edit(`${days[i].getDate()}: quota not available`);
                    }
                  });
                });
              });
            }

            sent.edit(message);
          });
        });
      } catch (error) {
        message = "error";
        sent.edit(message);
      }
    });
  });
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
