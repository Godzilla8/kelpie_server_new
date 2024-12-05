import crypto from "crypto";

const validateTelegramData = (initData) => {
  if (!initData) return false;

  const encoded = decodeURIComponent(initData);
  const secret = crypto.createHmac("sha256", "WebAppData").update(process.env.TELEGRAM_TOKEN);

  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const userIndex = arr.findIndex((str) => str.startsWith("user="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  const userObj = arr.slice(userIndex, userIndex + 1)[0].split("=")[1];

  const userData = JSON.parse(userObj);
  arr.sort((a, b) => a.localeCompare(b));
  const dataCheckString = arr.join("\n");

  console.log(userData);

  const _hash = crypto.createHmac("sha256", secret.digest()).update(dataCheckString).digest("hex");

  if (hash !== _hash) return false;

  return userData;
};

export default validateTelegramData;
