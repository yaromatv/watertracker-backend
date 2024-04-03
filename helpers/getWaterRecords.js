import Water from "../schemas/waterSchemas.js";

const getWaterRecords = async (owner, startPoint, endPoint) => {
  const waterRecordList = await Water.find(
    {
      owner,
      date: { $gte: startPoint, $lt: endPoint },
    },
    "amount date"
  );

  return waterRecordList;
};

export default getWaterRecords;
