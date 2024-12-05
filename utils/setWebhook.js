// import fetch from "node-fetch";
// import { config } from "dotenv";
// config();

// const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
// const NGROK_URL = "https://3e60-197-211-58-165.ngrok-free.app"; // Replace with your ngrok URL

// (async () => {
//   const webhookUrl = `${NGROK_URL}/webhook`;
//   const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ url: webhookUrl }),
//   });

//   const data = await response.json();
//   console.log("Webhook setup response:", data);
// })();
