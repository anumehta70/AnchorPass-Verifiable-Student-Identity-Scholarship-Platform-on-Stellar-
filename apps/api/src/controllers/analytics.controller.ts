import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const proofSchema = z.object({
  name: z.string().min(1),
  walletAddress: z.string().min(20),
  action: z.string().min(1),
  transactionHash: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
  feedback: z.string().optional(),
});

export async function recordInteractionProof(req: Request, res: Response) {
  const body = proofSchema.parse(req.body);
  const proof = await prisma.userInteractionProof.create({ data: body });
  res.status(201).json(proof);
}

export async function listInteractionProof(_req: Request, res: Response) {
  const proofs = await prisma.userInteractionProof.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(proofs);
}

/**
 * Powers the README's "10 real users" table and a simple dashboard summary
 * for the submission — counts unique wallets, total claims, avg rating.
 */
export async function analyticsSummary(_req: Request, res: Response) {
  const [uniqueWallets, scholarshipCount, credentialCount, claimCount, feedbackAgg] =
    await Promise.all([
      prisma.userInteractionProof.findMany({
        distinct: ["walletAddress"],
        select: { walletAddress: true },
      }),
      prisma.scholarship.count(),
      prisma.credential.count(),
      prisma.scholarshipAssignment.count({ where: { claimed: true } }),
      prisma.feedback.aggregate({ _avg: { rating: true }, _count: true }),
    ]);

  res.json({
    uniqueWalletsOnboarded: uniqueWallets.length,
    totalScholarships: scholarshipCount,
    totalCredentialsIssued: credentialCount,
    totalClaims: claimCount,
    averageFeedbackRating: feedbackAgg._avg.rating ?? null,
    feedbackResponses: feedbackAgg._count,
  });
}
