import { Router } from "express";
import auth from "../middlewares/auth";
import { create, readOne } from "../controllers/Project";

const router = Router();

router.post("/", auth, create);

// read one project
router.get("/:id", readOne);

export default router;
