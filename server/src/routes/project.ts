import { Router } from "express";
import auth from "../middlewares/auth";
import { create, readOne, deleteOne } from "../controllers/Project";

const router = Router();

router.post("/", auth, create);

// read one project
router.get("/:id", readOne);

// delete one projects
router.delete("/:id", auth, deleteOne);

export default router;
