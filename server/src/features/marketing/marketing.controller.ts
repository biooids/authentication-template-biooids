// FILE: src/features/marketing/marketing.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { marketingService } from "./marketing.service.js";

class MarketingController {
  createEmail = asyncHandler(async (req: Request, res: Response) => {
    const email = await marketingService.create(req.body);
    res.status(201).json({ status: "success", data: { email } });
  });

  getAllEmails = asyncHandler(async (_req: Request, res: Response) => {
    const emails = await marketingService.getAll();
    res.status(200).json({ status: "success", data: { emails } });
  });

  getEmailById = asyncHandler(async (req: Request, res: Response) => {
    const email = await marketingService.getById(req.params.id);
    res.status(200).json({ status: "success", data: { email } });
  });

  updateEmail = asyncHandler(async (req: Request, res: Response) => {
    const email = await marketingService.update(req.params.id, req.body);
    res.status(200).json({ status: "success", data: { email } });
  });

  deleteEmail = asyncHandler(async (req: Request, res: Response) => {
    await marketingService.delete(req.params.id);
    res.status(204).send();
  });

  sendCampaign = asyncHandler(async (req: Request, res: Response) => {
    const result = await marketingService.send(req.params.id);
    res.status(200).json({
      status: "success",
      message: `Campaign sent to ${result.sentCount} user(s).`,
      data: result,
    });
  });
}

export const marketingController = new MarketingController();
