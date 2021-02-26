const people = require("../../data.json");
const Discord = require("discord.js");
module.exports = {
  name: "whois",
  description: "whois",
  execute(message, args) {
    const findPerson = (id) => {
      notFound = true;
      people.forEach((person) => {
        person.discord.forEach((discordId) => {
          if (id == discordId) {
            notFound = false;
            const embed = new Discord.MessageEmbed()
              .attachFiles(["src/images/logo.png"])
              .setColor("RANDOM")
              .setTitle(person.name)
              .setURL(person.url)
              .setTimestamp()
              .setFooter("RoyahBot", "attachment://logo.png");

            return message.channel.send(embed);
          }
        });
      });
      if (notFound) return message.channel.send("User bukan anak royah");
    };

    if (args.length > 0) {
      mentionedUserId = message.mentions.members.first().id;
      findPerson(mentionedUserId);
    } else {
      findPerson(message.author.id);
    }
  },
};
