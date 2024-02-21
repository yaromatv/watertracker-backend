import express from "express";

import authControllers from "../controllers/authControllers.js";
const { register, login, logout, getCurrent } = authControllers;

import { authenticate, isEmptyBody, validateBody } from "../helpers/index.js";
import { userSignSchema } from "../schemas/userSchemas.js";

const userSignValidate = validateBody(userSignSchema);

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, userSignValidate, register);

authRouter.post("/login", isEmptyBody, userSignValidate, login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrent);

export default authRouter;
