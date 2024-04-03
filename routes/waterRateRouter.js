import express from "express";
const waterRateRouter = express.Router();
import waterRateControllers from "../controllers/waterRateControllers.js";
import validateBody from "../helpers/validateBody.js";
import { waterRateSchema } from "../schemas/waterRateSchema.js";
import authenticate from "../helpers/authenticate.js";

const { updateWaterRate } = waterRateControllers;
waterRateRouter.use(authenticate);
waterRateRouter.patch("/rate", validateBody(waterRateSchema), updateWaterRate);

export default waterRateRouter;
