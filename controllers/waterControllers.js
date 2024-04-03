import User from "../schemas/userSchemas.js";
import Water from "../schemas/waterSchemas.js";
import HttpError, {
  calculateWaterPercent,
  ctrlWrapper,
  getDaysInMonth,
  getStartAndEndOfDay,
  getWaterListInfo,
  getWaterRecords,
  totalDailyWater,
} from "../helpers/index.js";

const getWater = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const { _id: owner } = req.user;

  const result = await Water.find(
    { owner },
    {},
    {
      skip,
      limit,
    }
  ).populate("owner", "email");
  res.json(result);
};

const getOneWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;

  const result = await Water.findOne({ _id: waterId, owner });
  if (!result) {
    throw HttpError(404, `Water record with id: ${waterId} not found`);
  }
  res.json(result);
};

const getTodayWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterRate } = await User.findById(owner);
  // Можна ввести в new Date() будь-яку дату в форматі "2024-01-15"
  const day = new Date(Date.now());
  const { startOfDay, endOfDay } = getStartAndEndOfDay(day);
  const dailyWaterList = await getWaterRecords(owner, startOfDay, endOfDay);
  const total = await totalDailyWater(dailyWaterList);
  const percent = calculateWaterPercent(total, waterRate);

  res.status(200).json({
    statsForDay: day,
    total,
    percent,
    dailyWaterList,
  });
};

const getMonthWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterRate } = await User.findById(owner);
  const { year, month } = req.body;
  const daysInMonth = getDaysInMonth(year, month);
  const monthlyWaterList = [];
  const waterListInfoByDay = {};

  if (!month || !year) {
    throw HttpError(404, `The date is incorrect`);
  }

  const waterListInfo = await getWaterListInfo(owner, month, year);

  for (let record of waterListInfo) {
    waterListInfoByDay[record.day] = record;
  }

  for (let index = 1; index <= daysInMonth; index += 1) {
    const currentDay = waterListInfoByDay[index];
    const percent = calculateWaterPercent(currentDay?.total || 0, waterRate);

    monthlyWaterList.push({
      waterRate: waterRate,
      percent: percent,
      quantity: currentDay?.count || null,
      date: {
        day: index,
        month,
      },
    });
  }

  res.status(200).json(monthlyWaterList);
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Water.create({ ...req.body, owner });

  res.status(201).json(result);
};

const updateWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;

  const result = await Water.findOneAndUpdate(
    { _id: waterId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Water record with id: ${waterId} not found`);
  }

  res.json(result);
};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;

  const result = await Water.findOneAndDelete({ _id: waterId, owner });
  if (!result) {
    throw HttpError(404, `Water record with id: ${waterId} not found`);
  }
  res.status(200).json(result);
};

export default {
  getWater: ctrlWrapper(getWater),
  getOneWater: ctrlWrapper(getOneWater),
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
  getTodayWater: ctrlWrapper(getTodayWater),
  getMonthWater: ctrlWrapper(getMonthWater),
};
