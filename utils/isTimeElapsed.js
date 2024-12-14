export default (startDate, elapseTimeInSeconds) => {
  const nowInseconds = new Date().getTime() / 1000;
  const startInSeconds = startDate.getTime() / 1000;
  const difference = nowInseconds - startInSeconds;
  if (difference >= elapseTimeInSeconds) return true;
  return false;
};
