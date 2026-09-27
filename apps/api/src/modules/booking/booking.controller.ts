import { Response, NextFunction } from "express";
import { createBookingSchema, updateBookingStatusSchema } from "./booking.schema";
import * as bookingService from "./booking.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function createHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = createBookingSchema.parse(req.body);
    const booking = await bookingService.createBooking(req.userId!, input);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function sentHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.listSentBookings(req.userId!);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function receivedHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.listReceivedBookings(req.userId!);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function statusHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = updateBookingStatusSchema.parse(req.body);
    const booking = await bookingService.updateBookingStatus(req.userId!, req.params.id, status);
    res.json(booking);
  } catch (err) {
    next(err);
  }
}
