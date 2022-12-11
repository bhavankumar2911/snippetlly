import { Router } from "express";
import { exchangeToken, login, signup } from "../controllers/auth";
import auth from "../middlewares/auth";

const authRouter = Router();

// register/signup
authRouter.post("/signup", signup);

// login
authRouter.post("/login", login);

// exchange token
authRouter.get("/exchange", exchangeToken);

// check authentication
authRouter.get("/", auth);

export default authRouter;
