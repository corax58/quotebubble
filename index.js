const TelegramBot = require("node-telegram-bot-api");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
require("dotenv").config();

const token = process.env.TOKEN; // Replace with your own bot token
const bot = new TelegramBot(token, { polling: true });

const images = [
  "chillcat.png",
  "emo.png",
  "facts.png",
  "fatman.png",
  "femboy.png",
  "monkey.png",
  "nerd1.png",
  "nerd2.png",
  "smallcat.png",
  "tard.png",
];

const par = [
  "chillcat",
  "emo",
  "fact",
  "fat",
  "femboy",
  "monkey",
  "nerd1",
  "nerd2",
  "smol",
  "tard",
];

bot.on("message", (msg) => {
  const command = msg.text.slice(0, 5);
  console.log(command);
  const chatId = msg.chat.id;

  const messageText = msg.text;

  if (messageText === "/start") {
    bot.sendMessage(chatId, "Welcome to the bot!");
  }

  if (msg.reply_to_message && command === "/coco") {
    const id = uuidv4();
    const parameter = msg.text.split(" ")[1];
    const outputFolder = "./tempoutput/" + id + ".jpg";
    const repliedMessage = msg.reply_to_message.text;
    const repliedMessageID = msg.reply_to_message.message_id;

    const index = par.indexOf(parameter);

    if (index != -1 && index != null) {
      const image = Jimp.read("./images/" + images[index]).then((image) => {
        return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then((font) => {
          image.print(font, 10, 10, repliedMessage);
          console.log("three");

          return image.writeAsync(outputFolder).then((res) => {
            bot
              .sendPhoto(chatId, outputFolder, {
                reply_to_message_id: repliedMessageID,
              })
              .then((res) => {
                fs.unlink(outputFolder, (err) => {
                  if (err) {
                    console.error("Error deleting file:", err);
                    return;
                  }
                  console.log("File deleted successfully");
                });
              });
          });
        });
      });
    }
  }
});
