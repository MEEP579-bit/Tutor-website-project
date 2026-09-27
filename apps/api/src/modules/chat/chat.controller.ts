import { Response, NextFunction } from "express";
import { sendMessageSchema } from "./chat.schema";
import * as chatService from "./chat.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function listHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const messages = await chatService.listMessages(req.userId!, req.params.bookingId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function sendHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { content } = sendMessageSchema.parse(req.body);
    const message = await chatService.sendMessage(req.userId!, req.params.bookingId, content);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function listConversationsHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const conversations = await chatService.listConversations(req.userId!);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
}
