const setToMidnight = (date) => {
  return new Date(date).setHours(0, 0, 0, 0) + 3600000;
};

export default setToMidnight;
