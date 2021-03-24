const Discord = require("discord.js");
module.exports = {
  name: "help",
  description: "Bantuan",
  execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .attachFiles(["src/images/logo.png"])
      .setColor("RANDOM")
      .setTitle("Bantuan")
      .setURL(
        "https://itdev.royah.me/Discord-Bot-ee2e07e68e4646898bf7e4bccd2f25b8"
      )
      .setTimestamp()
      .setFooter("RoyahBot", "attachment://logo.png");

    return message.channel.send(embed);
  },
};
