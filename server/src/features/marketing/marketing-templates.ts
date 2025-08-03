// FILE: src/features/marketing/marketing-templates.ts

interface MarketingEmailContent {
  title: string;
  bodyHtml: string; // The main content comes directly from your admin editor
  appVersion?: string | null;
}

/**
 * Generates a unique, branded HTML layout specifically for marketing emails.
 * @param content - The specific content for the email.
 * @returns The complete HTML string for the email.
 */
export const generateMarketingEmailHtml = (
  content: MarketingEmailContent
): string => {
  const year = new Date().getFullYear();

  // Conditionally render an app version badge if it's provided
  const versionBadge = content.appVersion
    ? `<p class="version-badge">Update Version: ${content.appVersion}</p>`
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en" style="margin: 0; padding: 0">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Biooids Update</title>
        <style>
          body { margin: 0; padding: 0; background-color: #111827; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .email-wrapper { width: 100%; background-color: #111827; padding: 40px 20px; }
          .email-content { max-width: 640px; margin: 0 auto; background-color: #1F2937; border-radius: 12px; overflow: hidden; border: 1px solid #374151; }
          .email-header { padding: 32px; text-align: center; background-color: #111827; }
          .email-header img { height: 56px; }
          .email-body { padding: 24px 32px 40px; color: #D1D5DB; }
          /* Styles for the content coming from your editor */
          .email-body h1, .email-body h2, .email-body h3 { color: #F9FAFB; margin-top: 24px; }
          .email-body p { font-size: 16px; line-height: 1.7; margin: 16px 0; }
          .email-body a { color: #60A5FA; text-decoration: underline; }
          .email-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
          .version-badge { background-color: #374151; color: #9CA3AF; font-size: 12px; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 0; }
          .email-footer { padding: 24px; text-align: center; font-size: 13px; color: #6B7280; }
          .email-footer a { color: #9CA3AF; text-decoration: none; margin: 0 4px; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-content">
            <header class="email-header">
              <img src="https://res.cloudinary.com/djtww0vax/image/upload/v1747766773/xi-biooid_bstapi.jpg" alt="Biooids Logo" />
            </header>
            <main class="email-body">
              ${versionBadge}
              ${content.bodyHtml}
            </main>
          </div>
          <footer class="email-footer">
            <p>© ${year} Biooids. All rights reserved.</p>
            <p><a href="https://biooids.com/settings">Unsubscribe</a> | <a href="https://biooids.com">Biooids.com</a></p>
          </footer>
        </div>
      </body>
    </html>
  `;
};
