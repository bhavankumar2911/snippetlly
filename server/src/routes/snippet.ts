import { Router } from "express";
import { deleteSnippet, editSnippet } from "../controllers/Snippet";
import auth from "../middlewares/auth";

const router = Router();

router.delete("/:id", auth, deleteSnippet);

router.put("/:id", auth, editSnippet);

export default router;
