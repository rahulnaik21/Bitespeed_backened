const express = require("express");
const cors = require("cors");
app.use(cors());


const bodyParser = require("body-parser");

const identify = require("./identify");

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("BiteSpeed Backend is running");

});

app.post("/identify", identify);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
