import { Router } from "express";
import auth from "../middlewares/auth";
import {
  create,
  readOne,
  deleteOne,
  addMember,
  removeMember,
} from "../controllers/Project";
import { addSnippetToProject } from "../controllers/Snippet";

const router = Router();

router.post("/", auth, create);

// read one project
router.get("/:id", readOne);

// delete one projects
router.delete("/:id", auth, deleteOne);

// add member
router.post("/:id", auth, addMember);

// remove member
router.post("/remove-member/:id", auth, removeMember);

// add snippet
router.post("/snippet/:id", auth, addSnippetToProject);

export default router;
