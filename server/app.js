import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Users from "./Routes/User.js";

const app = express();
dotenv.config();
const Port = process.env.Port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", Users);

app.get("/", (req, res) => {
    res.status(200).json({
        Status: "Success",
        Message: "Server is running",
    });
});

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
