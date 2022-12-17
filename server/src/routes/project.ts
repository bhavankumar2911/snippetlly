import { Router } from "express";
import auth from "../middlewares/auth";
import { create, readOne, deleteOne, addMember } from "../controllers/Project";

const router = Router();

router.post("/", auth, create);

// read one project
router.get("/:id", readOne);

// delete one projects
router.delete("/:id", auth, deleteOne);

// add member
router.post("/:id", auth, addMember);

export default router;
