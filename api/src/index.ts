import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.send("Ok");
});

app.listen(process.env.PORT, () => {
  console.log(`Server up at ${process.env.PORT}!`);
});