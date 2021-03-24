const Discord = require("discord.js");
module.exports = {
  name: "curhat",
  description: "Curhat",
  execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .attachFiles(["src/images/logo.png"])
      .setColor("RANDOM")
      .setTitle("Klik untuk curhat")
      .setURL("https://royah.me/curhat")
      .setTimestamp()
      .setFooter("RoyahBot", "attachment://logo.png");

    return message.channel.send(embed);
  },
};
