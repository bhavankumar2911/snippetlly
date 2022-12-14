import { Router } from "express";
import { exchangeToken, login, logout, signup } from "../controllers/auth";
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

// logout user
authRouter.get("/logout", auth, logout);

export default authRouter;
