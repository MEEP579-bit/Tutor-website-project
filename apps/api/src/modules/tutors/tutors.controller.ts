import { Response, NextFunction } from "express";
import { updateTutorProfileSchema } from "./tutors.schema";
import * as tutorsService from "./tutors.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function listHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { subject, classGroup, region, mode, maxBudget, minRating, minExperience } = req.query;
    const tutors = await tutorsService.listTutors({
      subject: typeof subject === "string" && subject ? subject : undefined,
      classGroup: typeof classGroup === "string" && classGroup ? classGroup : undefined,
      region: typeof region === "string" && region ? region : undefined,
      mode: mode === "ONLINE" || mode === "OFFLINE" ? mode : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      minExperience: minExperience ? Number(minExperience) : undefined,
    });
    res.json(tutors);
  } catch (err) {
    next(err);
  }
}

export async function getByIdHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const tutor = await tutorsService.getTutorById(req.params.id);
    res.json(tutor);
  } catch (err) {
    next(err);
  }
}

export async function getMyProfileHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const profile = await tutorsService.getMyProfile(req.userId!);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfileHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = updateTutorProfileSchema.parse(req.body);
    const profile = await tutorsService.updateMyProfile(req.userId!, input);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
