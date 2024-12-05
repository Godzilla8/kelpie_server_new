import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import User from "../models/userModel.js";
import ShortUniqueId from "short-unique-id";

console.log("hit");
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

const handleTelegramBot = asyncErrorHandler(async (req, res, next) => {
  try {
    const { message } = req.body;
    console.log(message);
    if (message && message.text.startsWith("/start")) {
      const chat_id = message.chat.id;
      const username = message.chat.username;
      const referrer_id = message.text?.split(" ")[1];
      const user = await User.findOne({ chat_id });

      const inlineKeyboard = {
        inline_keyboard: [
          [{ text: "Open Kelpie App", web_app: { url: "https://kelpienetwork.com" } }],
        ],
      };

      if (!user) {
        const referrer = await User.findOne({ referral_id: referrer_id });
        const create_code = new ShortUniqueId({ length: 10 });
        const new_referral_id = create_code.rnd();

        await User.create({
          username,
          referral_id: new_referral_id,
          referrer_id: referrer ? referrer_id : null,
          chat_id,
        });

        console.log("User created!");

        bot.sendMessage(
          chat_id,
          "Collect rewards 🪙 on Kelpie Network by climbing 🪜 up the ranks, doing tasks and playing fun games 🎲. We are working on a whole new ecosystem 🚀🌍 and we are glad that you are part of it! 🤝🎉",
          {
            reply_markup: inlineKeyboard,
          }
        );
      } else {
        bot.sendMessage(
          chat_id,
          "Collect rewards 🪙 on Kelpie Network by climbing 🪜 up the ranks, doing tasks and playing fun games 🎲.\n\n We are working on a whole new ecosystem 🚀🌍 and we are glad that you are part of it! 🤝🎉",
          {
            reply_markup: inlineKeyboard,
          }
        );
      }
    }

    // Send the response after processing
    res.status(200).json({ message: "Request processed successfully" });
    // next();
  } catch (error) {
    // console.error("Error handling Telegram request:", error);
    // next(error);
    res.status(200).json({ error: "There was a server error" });
  }
});

export default handleTelegramBot;
