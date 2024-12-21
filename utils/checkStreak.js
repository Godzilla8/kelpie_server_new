import setToMidnight from "./setToMidnight.js";

const checkStreak = (lastLogin) => {
  try {
    const newLastLogin = new Date(lastLogin);
    const lastMidNight = setToMidnight(newLastLogin);
    const todayMidNight = setToMidnight(new Date());
    if (lastMidNight + 86400000 !== todayMidNight) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
};

export default checkStreak;
