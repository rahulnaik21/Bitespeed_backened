const express = require("express");
const bodyParser = require("body-parser");
// const { PrismaClient } = require("@prisma/client");
const identify = require("./identify");

const app = express();
// const prisma = new PrismaClient();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("BiteSpeed Backend is running");
});

app.post("/identify", identify);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
