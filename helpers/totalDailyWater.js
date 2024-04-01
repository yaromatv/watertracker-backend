const totalDailyWater = async (dailyWaterList) => {
  const total = await dailyWaterList.reduce(
    (acc, { amount }) => (acc += amount),
    0
  );

  return total;
};

export default totalDailyWater;
