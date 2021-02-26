const goodreads = require("goodreads-api-node");
const myCredentials = {
  key: process.env.GOODREADS_KEY,
  secret: process.env.GOODREADS_SECRET,
};
const gr = goodreads(myCredentials);
const Discord = require("discord.js");

module.exports = {
  name: "bookinfo",
  description: "get a book's information from goodreads api",
  aliases: ["book"],
  cooldown: 10,
  execute(message, args) {
    const sendMessage = (bookData) => {
      const getAuthor = () => {
        authors = bookData.authors.author;
        if (Array.isArray(authors)) {
          return authors[0].name;
        } else {
          return authors.name;
        }
      };

      const getImageUrl = () => {
        imageUrl = bookData.image_url;
        if (imageUrl) return imageUrl;
        return "https://via.placeholder.com/300";
      };

      const getDescription = () => {
        bookDescription = bookData.description
          .split("<br />")
          .join("\n")
          .split("<i>")
          .join("*")
          .split("</i>")
          .join("*");
        if (bookDescription.length > 1000) {
          bookDescription = bookDescription.slice(0, 1000);
          bookDescription += "...";
        }
        if (bookDescription) return bookDescription;
        return "no description";
      };

      const embedMessage = new Discord.MessageEmbed()
        .attachFiles(["src/images/goodreads.png"])
        .setColor("RANDOM")
        .setTitle(bookData.title)
        .setURL(bookData.url)
        .setThumbnail(getImageUrl())
        .addField("Author", getAuthor())
        .addField("Description", getDescription())
        .setFooter(
          "Data provided by Goodreads • RoyahBot (Beta)",
          "attachment://goodreads.png"
        )
        .setTimestamp();
      return message.channel.send(embedMessage);
    };

    const showBook = (bookId) => {
      setTimeout(() => {
        message.channel.send(`Found! Getting book data...`);
        gr.showBook(bookId).then((data) => {
          bookData = data.book;
          sendMessage(bookData);
        });
      }, 1000);
    };

    const query = args.join(" ");
    message.channel.send(`Searching for *${query}*...`);
    gr.searchBooks({ q: query, field: "all" }).then((data) => {
      results = data.search.results.work;
      if (Array.isArray(results)) {
        bookId = results[0].best_book.id._;
      } else {
        bookId = results.best_book.id._;
      }
      showBook(bookId);
    });
  },
};
