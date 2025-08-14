require('dotenv').config();
const express = require('express');
const app = express();
const messageRouter = require("./Routes/messages");
const authRouter = require("./Routes/auth");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/messages", messageRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}.`);
});