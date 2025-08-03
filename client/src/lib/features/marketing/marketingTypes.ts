// This enum must match the status strings used in your backend.
export enum MarketingEmailStatus {
  DRAFT = "draft",
  SENDING = "sending",
  SENT = "sent",
}

// This is the main shape of a single marketing email campaign object.
export interface MarketingEmail {
  id: string;
  subject: string;
  htmlContent: string;
  appVersion: string | null;
  status: MarketingEmailStatus;
  sentAt: string | null;
  createdAt: string;
}

// This type defines the data sent when creating or updating a campaign.
export type MarketingEmailDto = Pick<
  MarketingEmail,
  "subject" | "htmlContent"
> & {
  appVersion?: string;
};

// --- API Response Shapes ---

export interface GetAllMarketingEmailsApiResponse {
  status: string;
  data: {
    emails: MarketingEmail[];
  };
}

export interface GetMarketingEmailApiResponse {
  status: string;
  data: {
    email: MarketingEmail;
  };
}

export interface SendCampaignApiResponse {
  status: string;
  message: string;
  data: {
    sentCount: number;
  };
}
