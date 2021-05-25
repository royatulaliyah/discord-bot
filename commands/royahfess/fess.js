const { Fess } = require("../../db");
const Discord = require("discord.js");

module.exports = {
  name: "fess",
  description: "RoyahFess",
  dmOnly: true,
  async execute(message, args) {
    const content = args.join(" ");

    const fess = await Fess.create({
      authorId: message.author.id,
      content: content,
    });

    console.log(fess.toJSON());

    const webhookClient = new Discord.WebhookClient(
      process.env.WEBHOOK_FESS_ID,
      process.env.WEBHOOK_FESS_TOKEN
    );

    const embed = new Discord.MessageEmbed()
      .setAuthor(`[FESS]`)
      .setDescription(fess.content)
      .setTimestamp(fess.createdAt)
      .setColor("#0099ff");

    webhookClient.send(embed);

    return message.channel.send(
      "fess diterima! silakan datang ke <#691496506934689865> untuk melihat pesan kamu"
    );
  },
};
