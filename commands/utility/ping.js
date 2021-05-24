module.exports = {
  name: "ping",
  description: "Ping!",
  execute(message, args) {
    message.channel.send("<a:ping:846264946907545602>");
    message.channel.send("Pinging...").then((sent) => {
      sent.edit(`${sent.createdTimestamp - message.createdTimestamp}ms`);
    });
  },
};
