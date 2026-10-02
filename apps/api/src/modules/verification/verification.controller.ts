import { Response, NextFunction } from "express";
import { submitDocumentSchema, reviewDocumentSchema } from "./verification.schema";
import * as verificationService from "./verification.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function submitHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = submitDocumentSchema.parse(req.body);
    const doc = await verificationService.submitDocument(req.userId!, input);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function listMineHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const docs = await verificationService.listMyDocuments(req.userId!);
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

export async function listPendingHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const docs = await verificationService.listPendingDocuments();
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

export async function reviewHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = reviewDocumentSchema.parse(req.body);
    const doc = await verificationService.reviewDocument(req.userId!, req.params.id, status);
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
