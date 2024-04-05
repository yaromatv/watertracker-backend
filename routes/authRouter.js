import express from "express";

import authControllers from "../controllers/authControllers.js";
const { register, login, logout, getCurrent, updateCurrent, updateAvatar } =
    authControllers;

import {
    authenticate,
    isEmptyBody,
    validateBody,
    upload,
} from "../helpers/index.js";
import { userSignSchema, userUpdateSchema } from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    isEmptyBody,
    validateBody(userSignSchema),
    register
);

authRouter.post("/login", isEmptyBody, validateBody(userSignSchema), login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrent);

authRouter.patch(
    "/current",
    authenticate,
    validateBody(userUpdateSchema),
    updateCurrent
);

authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    updateAvatar
);

export default authRouter;
