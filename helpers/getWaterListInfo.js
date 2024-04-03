import getWaterRecords from "./getWaterRecords.js";

const getWaterListInfo = async (owner, month, year) => {
  const startOfMonth = new Date(year, month - 1);
  const endOfMonth = new Date(year, month);
  const waterRecords = await getWaterRecords(owner, startOfMonth, endOfMonth);
  let result = [];

  const groupedRecords = waterRecords.reduce((acc, record) => {
    const day = record.date.getDate();

    if (!acc[day]) {
      acc[day] = { total: 0, count: 0 };
    }

    acc[day].total += record.amount;
    acc[day].count += 1;

    return acc;
  }, {});

  for (let day in groupedRecords) {
    let record = groupedRecords[day];

    result.push({
      month,
      day: Number(day),
      total: record.total,
      count: record.count,
    });
  }

  return result;
};

export default getWaterListInfo;
