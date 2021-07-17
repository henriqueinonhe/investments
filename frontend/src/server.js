const express = require("express");
require("dotenv").config();
const { resolve } = require("path");

const app = express();

app.use(express.static("public"));
app.all("*", (req, res) => {
  res.sendFile(resolve(__dirname, "../public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Frontend up at ${process.env.PORT}`);
});