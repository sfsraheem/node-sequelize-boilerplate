// package imports
import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { config, initDbConnection } from "./configs";
import { errorHandler, notFound } from "./middlewares";
import router from "./routes/routes";

const app = express();

const corsOptions = {
  origin: config.FRONT_END_URL,
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// serve static files
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/v1", router);

// // middlewares
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await initDbConnection();

    app.listen(config.PORT, () => {
      console.log("Server is listening on: " + config.PORT);
    });
  } catch (error) {
    console.log("error", error);
  }
};

start();
