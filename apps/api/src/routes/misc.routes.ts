import { Router } from "express";
import { submitFeedback, listFeedback } from "../controllers/feedback.controller.js";
import {
  recordInteractionProof,
  listInteractionProof,
  analyticsSummary,
} from "../controllers/analytics.controller.js";

export const feedbackRouter = Router();
feedbackRouter.post("/", submitFeedback);
feedbackRouter.get("/", listFeedback);

export const analyticsRouter = Router();
analyticsRouter.post("/interaction-proof", recordInteractionProof);
analyticsRouter.get("/interaction-proof", listInteractionProof);
analyticsRouter.get("/summary", analyticsSummary);
