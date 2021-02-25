module.exports = {
  name: "help",
  description: "Bantuan",
  execute(message, args) {
    message.channel.send(
      "Lihat bantuan di sini:\nhttps://royatulaliyah.netlify.app/discord"
    );
  },
};
