// FILE: src/features/marketing/marketing-templates.ts

interface MarketingEmailContent {
  title: string;
  bodyHtml: string; // Comes from admin/editor, should be trusted HTML
  appVersion?: string | null;
}

export const generateMarketingEmailHtml = (
  content: MarketingEmailContent
): string => {
  const year = new Date().getFullYear();

  const versionBadge = content.appVersion
    ? `<div class="version-badge">Version ${content.appVersion}</div>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${content.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #111827;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #D1D5DB;
    }

    header {
      width: 100%;
      background-color: #1F2937;
    }

    .hero-banner {
      position: relative;
      width: 100%;
      height: 180px;
      overflow: hidden;
    }

    .hero-banner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .hero-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 12px 24px;
      background: linear-gradient(to top, #111827cc 60%, transparent);
      color: #F9FAFB;
      font-size: 24px;
      font-weight: 600;
    }

    main {
      max-width: 640px;
      margin: 0 auto;
      background-color: #1F2937;
      border: 1px solid #374151;
      border-radius: 12px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .email-header {
      text-align: center;
      padding: 24px 16px;
    }

    .email-header img {
      max-height: 48px;
    }

    .version-badge {
      background-color: #374151;
      color: #9CA3AF;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .email-body {
      padding: 32px;
      font-size: 16px;
      line-height: 1.7;
    }

    .email-body h1, .email-body h2, .email-body h3 {
      color: #F9FAFB;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    .email-body p {
      margin: 16px 0;
    }

    .email-body a {
      color: #60A5FA;
      text-decoration: underline;
    }

    .email-body img {
      max-width: 100%;
      border-radius: 8px;
      margin: 20px 0;
    }

    footer {
      text-align: center;
      padding: 24px 16px;
      font-size: 13px;
      color: #6B7280;
      background-color: #111827;
    }

    footer a {
      color: #9CA3AF;
      margin: 0 6px;
      text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 24px 20px;
      }

      .hero-overlay {
        font-size: 20px;
        padding: 10px 16px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="hero-banner">
      <img src="https://res.cloudinary.com/djtww0vax/image/upload/v1747766773/xi-biooid_bstapi.jpg" alt="Biooids Banner"/>
      <div class="hero-overlay">${content.title}</div>
    </div>
  </header>

  <main>
    <div class="email-header">
      ${versionBadge}
    </div>
    <div class="email-body">
      ${content.bodyHtml}
    </div>
  </main>

  <footer>
    <p>© ${year} Biooids. All rights reserved.</p>
    <p>
      <a href="https://biooids.com/settings">Unsubscribe</a> |
      <a href="https://biooids.com">Visit Website</a>
    </p>
  </footer>
</body>
</html>
`;
};
