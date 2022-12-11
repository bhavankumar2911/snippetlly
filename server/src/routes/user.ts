import { Router } from "express";
import { ReadOtherUser, ReadOwnProfile } from "../controllers/User";
import auth from "../middlewares/auth";

const router = Router();

router.get("/:username", ReadOtherUser);

router.get("/", auth, ReadOwnProfile);

export default router;
