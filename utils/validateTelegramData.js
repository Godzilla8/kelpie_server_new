import "dotenv/config";
import crypto from "crypto";

const validateTelegramData = (initData) => {
  if (!initData) return false;

  const encoded = decodeURIComponent(initData);
  const params = new URLSearchParams(encoded);

  // Extract and remove the hash from the parameters
  const receivedHash = params.get("hash");
  if (!receivedHash) return false;
  params.delete("hash");

  // Sort and concatenate the remaining parameters
  const dataCheckString = Array.from(params.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Create the secret key
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.TELEGRAM_TOKEN)
    .digest();

  // Generate the HMAC hash
  const generatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Compare hashes
  if (receivedHash !== generatedHash) {
    console.log("Hash mismatch:", { receivedHash, generatedHash, dataCheckString });
    return false;
  }

  // Parse the user data (optional, based on your needs)
  const user = params.get("user");
  let userData;
  try {
    userData = JSON.parse(user);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return false;
  }

  return userData;
};

export default validateTelegramData;

// import "dotenv/config";
// import crypto from "crypto";

// const validateTelegramData = (initData) => {
//   if (!initData) return false;

//   const encoded = decodeURIComponent(initData);
//   const secret = crypto.createHmac("sha256", "WebAppData").update(process.env.TELEGRAM_TOKEN);

//   const arr = encoded.split("&");
//   const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
//   const userIndex = arr.findIndex((str) => str.startsWith("user="));
//   const hash = arr.splice(hashIndex)[0].split("=")[1];
//   const userObj = arr.slice(userIndex, userIndex + 1)[0].split("=")[1];

//   const userData = JSON.parse(userObj);
//   arr.sort((a, b) => a.localeCompare(b));
//   const dataCheckString = arr.join("\n");

//   const _hash = crypto.createHmac("sha256", secret.digest()).update(dataCheckString).digest("hex");

//   if (hash !== _hash) return false;

//   return userData;
// };

// export default validateTelegramData;
