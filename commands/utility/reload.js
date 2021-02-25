const fs = require("fs");

module.exports = {
  name: "reload",
  description: "Reloads a command",
  execute(message, args) {
    //reloading a command
    const commandNameReload = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandNameReload) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandNameReload)
      );
    if (!command)
      return message.channel.send(
        `There is no command with name or alias \`${commandNameReload}\`, ${message.author}!`
      );
    const commandFolders = fs.readdirSync("./commands");
    const folderName = commandFolders.find((folder) =>
      fs.readdirSync(`./commands/${folder}`).includes(`${commandNameReload}.js`)
    );
    delete require.cache[
      require.resolve(`../${folderName}/${command.name}.js`)
    ];
    try {
      const newCommand = require(`../${folderName}/${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${command.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
  },
};
