import Water from "../schemas/waterSchemas.js";
import HttpError, {
    calculateWaterPercent,
    ctrlWrapper,
    getStartAndEndOfDay,
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
    // const { day } = req.body;

    // Можна ввести в new Date() будь-яку дату в форматі "2024-01-15"
    const day = new Date();
    console.log(day);
    const { startOfDay, endOfDay } = getStartAndEndOfDay(day);

    const dailyWaterList = await Water.find(
        {
            owner,
            date: { $gte: startOfDay, $lt: endOfDay },
        },
        "amount date"
    ).exec();

    const total = await totalDailyWater(dailyWaterList);

    const percent = calculateWaterPercent(total, 5000);

    res.status(200).json({
        statsForDay: day,
        total,
        percent,
        dailyWaterList,
    });
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
};
