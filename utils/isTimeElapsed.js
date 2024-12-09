export default (startDate, elapseTimeInSeconds) => {
  const nowInseconds = new Date().getTime();
  const startInSeconds = startDate.getTime();
  const difference = nowInseconds - startInSeconds;
  if (difference >= elapseTimeInSeconds) return true;
  return false;
};
