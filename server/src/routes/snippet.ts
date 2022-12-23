import { Router } from "express";
import { deleteSnippet } from "../controllers/Snippet";
import auth from "../middlewares/auth";

const router = Router();

router.delete("/:id", auth, deleteSnippet);

export default router;
