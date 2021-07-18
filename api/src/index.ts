import express from "express";
import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { handleError } from "./middlewares/handleError";
import { router } from "./routes";
import { env } from "./env";
import cors from "cors";

(async () => {
  try {
    const connectionOptions = await getConnectionOptions();
    await createConnection({
      ...connectionOptions,
      entities: ["dist/entities/**/*.js"],
      migrations: ["dist/migrations/**/*.js"],
      cli: {
        migrationsDir: "src/migrations"
      },
      migrationsTableName: "Migrations"
    });
  }
  catch(error) {
    console.log(error);
  }
  
  const app = express();
  app.use(express.json());
  app.use(express.static("public"));
  app.use(cors());
  
  app.get("/health", (req, res) => {
    res.send("Ok");
  });

  app.use(router);
  app.use(handleError);
  
  app.listen(env.PORT, () => {
    console.log(`API up at ${process.env.PORT}!`);
  });
})();
