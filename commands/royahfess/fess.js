const { Fess } = require("../../db");
const Discord = require("discord.js");
const { isMemberById } = require("../../src/utils/findperson");

module.exports = {
  name: "fess",
  description: "RoyahFess",
  dmOnly: true,
  async execute(message, args) {
    const content = args.join(" ");

    if (!isMemberById(message.author.id)) {
      return message.channel.send(
        "akun kamu belum terverifikasi. jika kamu anak royah, silakan hubungi admin"
      );
    }

    if (!content) {
      return message.channel.send("tidak bisa mengirim fess kosong");
    }

    const fess = await Fess.create({
      authorId: message.author.id,
      content: content,
    });

    console.log(fess.toJSON());

    const webhookClient = new Discord.WebhookClient(
      process.env.WEBHOOK_FESS_ID,
      process.env.WEBHOOK_FESS_TOKEN
    );

    webhookClient.send(fess.content);

    return message.channel.send(
      "fess diterima! silakan datang ke <#691496506934689865> untuk melihat pesan kamu"
    );
  },
};
