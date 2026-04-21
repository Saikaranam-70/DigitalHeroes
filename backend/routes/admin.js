import { Router } from "express";
import {
  getStats, getUsers, updateUser, editUserScore, getPayments
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:userId", updateUser);
router.put("/users/:userId/scores/:scoreId", editUserScore);
router.get("/payments", getPayments);

export default router;
