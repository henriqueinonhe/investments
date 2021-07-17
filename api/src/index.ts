import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import { handleError } from "./middlewares/handleError";
import { router } from "./routes";

dotenv.config();

(async () => {
  try {
    await createConnection();
  }
  catch(error) {
    console.log(error);
  }
  
  const app = express();
  app.use(express.json());
  app.use(express.static("public"));
  
  app.get("/health", (req, res) => {
    res.send("Ok");
  });

  app.use(router);
  app.use(handleError);
  
  app.listen(process.env.PORT, () => {
    console.log(`Server up at ${process.env.PORT}!`);
  });
})();
