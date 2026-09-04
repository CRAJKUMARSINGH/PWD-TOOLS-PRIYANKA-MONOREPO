import { Router, type IRouter } from "express";
import correspondenceRouter from "./correspondence";
import healthRouter from "./health";
import legalRouter from "./legal";

const router: IRouter = Router();

// ── Core ──────────────────────────────────────────────────────────────────
router.use(healthRouter);

// ── Correspondence-Assistant  →  /api/correspondence/* ────────────────────
router.use("/correspondence", correspondenceRouter);

// ── Legal-Document-Wizard    →  /api/legal/* ──────────────────────────────
router.use("/legal", legalRouter);

export default router;
