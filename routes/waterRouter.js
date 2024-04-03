import express from "express";

import waterControllers from "../controllers/waterControllers.js";
const {
  getWater,
  getOneWater,
  addWater,
  updateWater,
  deleteWater,
  getTodayWater,
  getMonthWater,
} = waterControllers;

import {
  authenticate,
  isEmptyBody,
  validateBody,
  isValidId,
} from "../helpers/index.js";
import { addWaterSchema } from "../schemas/waterSchemas.js";

const addWaterValidate = validateBody(addWaterSchema);

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.get("/", getWater);

waterRouter.get("/today", getTodayWater);

waterRouter.get("/month", getMonthWater);

waterRouter.get("/:waterId", isValidId, getOneWater);

waterRouter.post("/", isEmptyBody, addWaterValidate, addWater);

waterRouter.put(
  "/:waterId",
  isValidId,
  isEmptyBody,
  addWaterValidate,
  updateWater
);

waterRouter.delete("/:waterId", isValidId, deleteWater);

export default waterRouter;
