import express, { ErrorRequestHandler } from "express";
import createError from "http-errors";
import connection from "./database/connection";
import authRouter from "./routes/auth";
import projectRouter from "./routes/project";
import cors from "cors";
import cookieParser from "cookie-parser";

// check db connection
connection
  .authenticate()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Cannot connect to database", err));

// syncing tables
// connection
//   .sync({ alter: true, force: true })
//   .then(() => console.log("Tables synced"))
//   .catch((err) => console.log("Cannot sync tables", err));

const app = express();

// parse requests
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ credentials: true, origin: ["http://localhost:9000"] }));

// api routes
app.use("/api/auth", authRouter);

// project routes
app.use("/api/project", projectRouter);

// 404 api request
app.use((req, res, next) => {
  return next(
    createError.NotFound("The requested resource is not found in the server")
  );
});

// error handling
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(status).json({
    error: {
      status,
      message,
    },
  });
};

app.use(errorHandler);

// server config
const PORT = process.env.PORT || 9000;
app.listen(9000, () => console.log(`Server is running on port ${PORT} 🚀`));
