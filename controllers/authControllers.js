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
    
    // "user": {
    //     "_id": "660ee67896cb13844f24456f",
    //     "email": "user1@mail.com",
    //     "password": "$2a$10$47KmA6qq4niggr9DRP8iFuM/v6ftZhBhX17DyHk.mWqtm/KaNsody",
    //     "avatarURL": "//www.gravatar.com/avatar/73dbb4ed51752f4d60afaeec8c9733e8",
    //     "waterRate": 2000,
    //     "createdAt": "2024-04-04T17:42:16.206Z",
    //     "updatedAt": "2024-04-05T06:09:08.797Z",
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGVlNjc4OTZjYjEzODQ0ZjI0NDU2ZiIsImlhdCI6MTcxMjI5NzM0OCwiZXhwIjoxNzEyMzgwMTQ4fQ.LVeEcq7hyqHYl_bDDFXyZxzHEnQvFYTNYinN20eIUfk",
    //     "gender": "Woman",
    //     "name": "Oleg"
    // }
    const {email,avatarURL,waterRate,gender,name} = user;
    const userData = {email,avatarURL,waterRate,gender,name}

    res.json( userData );
};

const updateCurrent = async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
    });
    if (!updatedUser) {
        throw HttpError(500, "User data failed to update");
    }
    const {email,avatarURL,waterRate,gender,name} = updatedUser;
    const userData = {email,avatarURL,waterRate,gender,name};

    res.json(userData);
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    await image.resize(Jimp.AUTO, 250).writeAsync(tempUpload);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateCurrent: ctrlWrapper(updateCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
};
