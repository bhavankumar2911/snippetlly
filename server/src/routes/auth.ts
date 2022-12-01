import { Router } from "express";
import { signup } from "../controllers/auth";

const authRouter = Router();

// register/signup
authRouter.post("/signup", signup);

export default authRouter;
