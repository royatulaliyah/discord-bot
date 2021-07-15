const people = require("../../data.json");
const Discord = require("discord.js");
const disButton = require("discord-buttons");

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
            let button = new disButton.MessageButton()
              .setStyle("url")
              .setURL(person.url)
              .setLabel(person.name);

            message.channel.send("‎", button);
          }
        });
      });
      if (notFound) return message.channel.send("User bukan anak royah");
    };

    if (args.length > 0) {
      let mentionedUser = message.mentions.members.first();

      if (mentionedUser) {
        mentionedUserId = message.mentions.members.first().id;
        findPerson(mentionedUserId);
      } else {
        message.channel.guild.members
          .fetch({ query: args[0], limit: 1 })
          .then((user) => {
            findPerson(user.first().id);
          })
          .catch((error) => {
            return message.channel.send(`User _${args[0]}_ tidak ditemukan`);
          });
      }
    } else {
      findPerson(message.author.id);
    }
  },
};
