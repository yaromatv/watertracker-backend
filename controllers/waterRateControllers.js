import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";
import User from "../schemas/userSchemas.js";

const updateWaterRate = async (req, res) => {
  const id = req.params.id;

  const { waterRate } = req.body;
  const result = await User.findOneAndUpdate(
    { _id: id },
    { waterRate },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, `User not found`);
  }

  res.json(result);
};

export default {
  updateWaterRate: ctrlWrapper(updateWaterRate),
};
