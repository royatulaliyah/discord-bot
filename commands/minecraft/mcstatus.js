const https = require("https");
const Discord = require("discord.js");
module.exports = {
  name: "mcstatus",
  description: "Bantuan",
  execute(message, args) {
    const sendMessage = (data) => {
      const embed = new Discord.MessageEmbed()
        .setTitle("Minecraft Server Status")
        .setTimestamp()
        .setFooter("RoyahBot", "attachment://logo.png");

      if (data.online) {
        embed.addField("Status", "online");
        embed.addField("Hostname", data.hostname);
        embed.addField("MOTD", data.motd.clean);
        embed.addField("Jumlah pemain online", `${data.players.online} orang`);
      } else {
        embed.addField("Status", "offline");
      }

      return message.channel.send(embed);
    };

    https
      .get("https://api.mcsrvstat.us/2/mc.royah.me", (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          sendMessage(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  },
};
