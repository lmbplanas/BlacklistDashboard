import express from "express";
import { getMnoStatuses, getStatusStats, refreshDomainStatus } from "../controllers/statusController.js";

const router = express.Router();

// GET /api/mno-statuses
router.get("/mno-statuses", getMnoStatuses);

// GET /api/stats
router.get("/stats", getStatusStats);

// POST /api/domains/refresh
router.post("/domains/refresh", refreshDomainStatus);

export default router;