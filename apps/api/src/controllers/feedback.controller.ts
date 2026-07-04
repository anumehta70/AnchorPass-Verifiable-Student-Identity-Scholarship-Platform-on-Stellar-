import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { track } from "../lib/monitoring.js";

const feedbackSchema = z.object({
  walletAddress: z.string().min(20),
  rating: z.number().int().min(1).max(5),
  message: z.string().optional(),
});

export async function submitFeedback(req: Request, res: Response) {
  const body = feedbackSchema.parse(req.body);

  const feedback = await prisma.feedback.create({ data: body });

  track("feedback_submitted", body.walletAddress, { rating: body.rating });

  res.status(201).json(feedback);
}

export async function listFeedback(_req: Request, res: Response) {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(feedback);
}
