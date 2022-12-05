import { Router } from "express";
import auth from "../middlewares/auth";

const router = Router();

router.post("/", auth, (req, res) => {
  res.send("project created");
});

export default router;
