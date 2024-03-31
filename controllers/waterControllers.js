import Water from "../schemas/waterSchemas.js";

import HttpError, {
  calculateWaterPercent,
  ctrlWrapper,
  getDateComponents,
  totalDailyWater,
} from "../helpers/index.js";

const getWater = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  console.log("req.params", req.params);

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

  console.log("req.params1", req.params);

  const result = await Water.findOne({ _id: waterId, owner });
  if (!result) {
    throw HttpError(404, `Water record with id: ${waterId} not found`);
  }
  res.json(result);
};

const getTodayWater = async (req, res) => {
  const { _id: owner } = req.user;
  //   const { dailyNorma } = await User.findById(owner);

  const { day, month, year } = getDateComponents(Date.now());

  const dailyWaterList = await Water.find(
    {
      owner,
      day,
      month,
      year,
    },
    "amount date"
  ).exec();

  const total = await totalDailyWater(dailyWaterList);

  const percent = calculateWaterPercent(total, 5000);

  res.status(201).json({
    percent,
    dailyWaterList,
  });
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { amount, date } = req.body;

  const { day, month, year } = getDateComponents(date);

  const result = await Water.create({ amount, date, day, month, year, owner });
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
};
