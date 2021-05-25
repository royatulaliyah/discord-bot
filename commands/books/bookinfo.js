const goodreads = require("goodreads-api-node");
const myCredentials = {
  key: process.env.GOODREADS_KEY,
  secret: process.env.GOODREADS_SECRET,
};
const gr = goodreads(myCredentials);
const Discord = require("discord.js");

const TurndownService = require("turndown");
const turndownService = new TurndownService();

module.exports = {
  name: "bookinfo",
  description: "get a book's information using goodreads api",
  aliases: ["book"],
  cooldown: 10,
  execute(message, args) {
    const sendMessage = (bookData) => {
      const getAuthor = () => {
        authors = bookData.authors.author;
        if (Array.isArray(authors)) {
          toReturn = [];
          authors.forEach((author) => {
            toReturn.push(author.name);
          });

          return toReturn.join(", ");
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
        bookDescription = turndownService.turndown(bookData.description);

        if (bookDescription.length > 1000) {
          bookDescription = bookDescription.slice(0, 1000);
          bookDescription += "...";
        }
        bookDescription += "\n\u200B";
        if (bookDescription) return bookDescription;
        return "no description";
      };

      const getISBN = () => {
        if (bookData.isbn13) return bookData.isbn13;
        return "no data";
      };

      const getAvgRating = () => {
        if (bookData.average_rating) {
          return bookData.average_rating + "/5";
        }
        return "no data";
      };

      const getTags = () => {
        tags = [];
        ignore = [
          "to-read",
          "currently-reading",
          "audiobooks",
          "audiobook",
          "my-library",
        ];
        bookData.popular_shelves.shelf.forEach((shelf) => {
          if (!ignore.includes(shelf.name)) tags.push(shelf.name);
        });

        if (tags.slice(0, 6).join(", ")) return tags.slice(0, 6).join(", ");
        return "no data";
      };

      const embedMessage = new Discord.MessageEmbed()
        .attachFiles(["src/images/goodreads.png"])
        .setColor("RANDOM")
        .setTitle(bookData.title + "\n\u200B")
        .setThumbnail(getImageUrl())
        .addField("Author", getAuthor())
        .addField("ISBN", getISBN(), true)
        .addField("Avg. Rating", getAvgRating(), true)
        .addField("Popular Tags", getTags())
        .addField("Description", getDescription())
        .addField("More about this book", bookData.url + "\n\u200B")
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
      try {
        if (Array.isArray(results)) {
          showBook(results[0].best_book.id._);
        } else {
          showBook(results.best_book.id._);
        }
      } catch (TypeError) {
        message.channel.send(`Book not found`);
      }
    });
  },
};
