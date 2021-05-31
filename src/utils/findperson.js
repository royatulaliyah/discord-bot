const people = require("../../data.json");

const isMemberById = (id) => {
  var found = false;

  people.forEach((person) => {
    person.discord.forEach((discordId) => {
      if (id == discordId) {
        found = true;
      }
    });
  });
  return found;
};

module.exports = { isMemberById };
