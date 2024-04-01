const getStartAndEndOfDay = (dateString) => {
  const today = new Date(dateString);

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  return { startOfDay, endOfDay };
};

export default getStartAndEndOfDay;
