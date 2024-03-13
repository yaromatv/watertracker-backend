import express from "express";

import authControllers from "../controllers/authControllers.js";
const { register, login, logout, getCurrent, updateAvatar } = authControllers;

import {
    authenticate,
    isEmptyBody,
    validateBody,
    upload,
} from "../helpers/index.js";
import { userSignSchema } from "../schemas/userSchemas.js";

const userSignValidate = validateBody(userSignSchema);

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, userSignValidate, register);

authRouter.post("/login", isEmptyBody, userSignValidate, login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrent);

authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    updateAvatar
);

export default authRouter;
