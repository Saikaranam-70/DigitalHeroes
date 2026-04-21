import { Router } from "express";
import {
  getDraws, getCurrentDraw, getUserDrawHistory, uploadWinnerProof,
  configureDraw, simulateDraw, publishDraw, verifyWinner, markPaid
} from "../controllers/drawController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getDraws);
router.get("/current", getCurrentDraw);
router.get("/my-history", protect, getUserDrawHistory);
router.post("/proof", protect, uploadWinnerProof);

router.post("/configure", protect, adminOnly, configureDraw);
router.post("/:drawId/simulate", protect, adminOnly, simulateDraw);
router.post("/:drawId/publish", protect, adminOnly, publishDraw);
router.post("/verify-winner", protect, adminOnly, verifyWinner);
router.post("/mark-paid", protect, adminOnly, markPaid);

export default router;
