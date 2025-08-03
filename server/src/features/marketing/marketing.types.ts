// FILE: src/features/marketing/marketing.types.ts

// Data Transfer Object for creating or updating a marketing email.
export interface MarketingEmailDto {
  subject: string;
  htmlContent: string;
  appVersion?: string;
}
