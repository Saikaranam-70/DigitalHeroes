import { Router } from "express";
import { addScore, editScore, deleteScore, getScores } from "../controllers/scoreController.js";
import { protect, subscribed } from "../middleware/auth.js";

const router = Router();

router.use(protect, subscribed);

router.get("/", getScores);
router.post("/", addScore);
router.put("/:scoreId", editScore);
router.delete("/:scoreId", deleteScore);

export default router;
