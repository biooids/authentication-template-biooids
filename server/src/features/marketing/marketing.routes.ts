// FILE: src/features/marketing/marketing.routes.ts

import { Router } from "express";
import { marketingController } from "./marketing.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/admin.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  createEmailSchema,
  updateEmailSchema,
} from "./marketing.validation.js";
import { SystemRole } from "@/prisma-client";

const router: Router = Router();

// Protect all marketing routes to be accessed only by SUPER_ADMINs
router.use(
  authenticate({ required: true }),
  requireRole([SystemRole.SUPER_ADMIN])
);

// CRUD routes for managing email content
router
  .route("/emails")
  .post(validate(createEmailSchema), marketingController.createEmail)
  .get(marketingController.getAllEmails);

router
  .route("/emails/:id")
  .get(marketingController.getEmailById)
  .patch(validate(updateEmailSchema), marketingController.updateEmail)
  .delete(marketingController.deleteEmail);

// Special action route to send the campaign
router.post("/emails/:id/send", marketingController.sendCampaign);

export default router;
