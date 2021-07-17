import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { handleError } from "./middlewares/handleError";
import { router } from "./routes";
import { env } from "./env";

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
  
  app.listen(env.PORT, () => {
    console.log(`API up at ${process.env.PORT}!`);
  });
})();
