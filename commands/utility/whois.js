const people = require("../../data.json");

module.exports = {
  name: "whois",
  description: "whois",
  guildOnly: true,
  execute(message, args) {
    const findPerson = (id) => {
      notFound = true;
      people.forEach((person) => {
        person.discord.forEach((discordId) => {
          if (id == discordId) {
            notFound = false;
            return message.channel.send(`${person.name}\n${person.url}`);
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
