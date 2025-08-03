// FILE: src/features/marketing/marketing.service.ts

import prisma from "../../db/prisma.js";
import { MarketingEmail } from "@/prisma-client";
import { MarketingEmailDto } from "./marketing.types.js";
import { createHttpError } from "../../utils/error.factory.js";
import { emailService } from "../email/email.service.js";
import { logger } from "../../config/logger.js";
// FIX: Import the NEW marketing template generator
import { generateMarketingEmailHtml } from "./marketing-templates.js";

class MarketingService {
  public async create(data: MarketingEmailDto): Promise<MarketingEmail> {
    return prisma.marketingEmail.create({ data });
  }

  public async getAll(): Promise<MarketingEmail[]> {
    return prisma.marketingEmail.findMany({ orderBy: { createdAt: "desc" } });
  }

  public async getById(id: string): Promise<MarketingEmail> {
    const email = await prisma.marketingEmail.findUnique({ where: { id } });
    if (!email) {
      throw createHttpError(404, "Marketing email not found.");
    }
    return email;
  }

  public async update(
    id: string,
    data: Partial<MarketingEmailDto>
  ): Promise<MarketingEmail> {
    const emailToUpdate = await this.getById(id);
    if (emailToUpdate.status !== "draft") {
      throw createHttpError(403, "Cannot edit an email that is not a draft.");
    }
    return prisma.marketingEmail.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<void> {
    const emailToDelete = await this.getById(id);
    if (emailToDelete.status !== "draft") {
      throw createHttpError(
        403,
        "Cannot delete a sent or in-progress campaign."
      );
    }
    await prisma.marketingEmail.delete({ where: { id } });
  }

  public async send(id: string): Promise<{ sentCount: number }> {
    const campaign = await this.getById(id);
    if (campaign.status !== "draft") {
      throw createHttpError(
        400,
        "This campaign has already been sent or is currently sending."
      );
    }

    await prisma.marketingEmail.update({
      where: { id },
      data: { status: "sending" },
    });

    const recipients = await prisma.user.findMany({
      where: {
        emailVerified: true,
        settings: {
          emailMarketing: true,
        },
      },
      select: {
        email: true,
        name: true,
      },
    });

    if (recipients.length === 0) {
      await prisma.marketingEmail.update({
        where: { id },
        data: { status: "sent", sentAt: new Date() },
      });
      return { sentCount: 0 };
    }

    logger.info(
      { campaignId: id, count: recipients.length },
      "Starting marketing email send job..."
    );

    for (const user of recipients) {
      // FIX: Use the new, dedicated marketing template generator
      const personalizedBody = campaign.htmlContent.replace(
        /{{USERNAME}}/g,
        user.name
      );
      const html = generateMarketingEmailHtml({
        title: campaign.subject,
        bodyHtml: personalizedBody,
        appVersion: campaign.appVersion,
      });

      // This call now works because sendEmail is public in email.service.ts
      await emailService.sendEmail(
        user.email,
        campaign.subject,
        html,
        `Biooids Updates <updates@${process.env.MAILGUN_DOMAIN}>`
      );
    }

    logger.info(
      { campaignId: id, count: recipients.length },
      "Marketing email send job completed."
    );

    await prisma.marketingEmail.update({
      where: { id },
      data: { status: "sent", sentAt: new Date() },
    });

    return { sentCount: recipients.length };
  }
}

export const marketingService = new MarketingService();
