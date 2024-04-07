import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { __dirname } from "../helpers/upload.js";

import User from "../schemas/userSchemas.js";

import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });

    if (existUser) {
        throw HttpError(409, `${email} is already in use`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
    });

    const payload = { id: newUser._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
        token,
        user: {
            email: newUser.email,
            name: newUser.name,
            avatarURL: newUser.avatarURL,
            waterRate: newUser.waterRate,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (!existUser) {
        throw HttpError(401, `Wrong email or password`);
    }

    const passwordCompare = await bcrypt.compare(password, existUser.password);
    if (!passwordCompare) {
        throw HttpError(401, `Wrong email or password`);
    }

    const payload = { id: existUser._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(existUser._id, { token });

    res.status(201).json({
        token,
        user: {
            email: existUser.email,
            name: existUser.name,
            avatarURL: existUser.avatarURL,
            waterRate: existUser.waterRate,
        },
    });
};

const logout = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { token: "" });
    res.status(204).json();
};

const getCurrent = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw HttpError(500, "Failed to fetch user data");
    }

    const { email, avatarURL, waterRate, gender, name } = user;
    const userData = { email, avatarURL, waterRate, gender, name };

    res.json(userData);
};

const updateCurrent = async (req, res) => {
    // AVATAR
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    await image.resize(Jimp.AUTO, 250).writeAsync(tempUpload);

    await fs.rename(tempUpload, resultUpload);

    const newAvatarURL = path.join("avatars", filename);
    // PASSWORD
    const { currentPass, newPass } = req.body;

    if (currentPass) {
        const { password: DBcurrentPass } = await User.findById(req.user._id);
        if (!DBcurrentPass) {
            throw HttpError(500, "Failed to fetch user data");
        }

        const passwordCompare = await bcrypt.compare(
            currentPass,
            DBcurrentPass
        );
        if (!passwordCompare) {
            throw HttpError(401, `Existing password is incorrect`);
        }

        req.body.password = await bcrypt.hash(newPass, 10);
    }
    //
    const updates = {
        gender: req.body.gender,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatarURL: newAvatarURL,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
    });
    if (!updatedUser) {
        throw HttpError(500, "User data failed to update");
    }
    const { email, avatarURL, waterRate, gender, name } = updatedUser;
    const userData = { email, avatarURL, waterRate, gender, name };

    res.json(userData);
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateCurrent: ctrlWrapper(updateCurrent),
};
