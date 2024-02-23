import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
});

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
    .connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Database connection successful. Use our API on port: ${PORT}`
            );
        });
    })
    .catch((error) => {
        console.log(error.message);
        process.exit(1);
    });
