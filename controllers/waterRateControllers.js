import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";
import User from "../schemas/userSchemas.js";

const updateWaterRate = async (req, res) => {
  const { authorization = "" } = req.headers;
  const [_, token] = authorization.split(" ");

  const { waterRate } = req.body;
  const result = await User.findOneAndUpdate(
    { token },
    { waterRate },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, `User not found`);
  }

  res.json("Water rate update successfully");
};

export default {
  updateWaterRate: ctrlWrapper(updateWaterRate),
};
