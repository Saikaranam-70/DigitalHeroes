import { Router } from "express";
import {
  getCharities, getCharity, selectCharity,
  createCharity, updateCharity, deleteCharity
} from "../controllers/charityController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getCharities);
router.get("/:id", getCharity);
router.post("/select", protect, selectCharity);

router.post("/", protect, adminOnly, createCharity);
router.put("/:id", protect, adminOnly, updateCharity);
router.delete("/:id", protect, adminOnly, deleteCharity);

export default router;
