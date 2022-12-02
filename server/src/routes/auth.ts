import { Router } from "express";
import { login, signup } from "../controllers/auth";

const authRouter = Router();

// register/signup
authRouter.post("/signup", signup);

// login
authRouter.post("/login", login);

export default authRouter;
