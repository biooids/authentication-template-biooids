// FILE: server/src/features/email/email-templates.ts

interface EmailContent {
  title: string;
  body: string;
  button?: {
    text: string;
    url: string;
  };
}

/**
 * Generates the full HTML for a branded email.
 * @param content - The specific content for the email body.
 * @returns The complete HTML string for the email.
 */
export const generateEmailHtml = (content: EmailContent): string => {
  const year = new Date().getFullYear();

  const buttonHtml = content.button
    ? `<div style="text-align:center;"><a href="${content.button.url}" class="email-button">${content.button.text}</a></div>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Biooids Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      header {
        width: 100%;
        background-color: #f4f4f7;
        margin-bottom: 16px;
      }
      .logo {
        width: 100%;
        height: 7rem;
        overflow: hidden;
      }
      .logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      header p {
        margin: 8px 0;
        text-align: center;
        font-size: 13px;
        color: #888;
        font-style: italic;
      }
      main {
        background-color: #ffffff;
        padding: 32px;
        box-sizing: border-box;
        color: #333333;
      }
      main h1 {
        margin: 0 0 16px;
        font-size: 24px;
        color: #111827;
        font-weight: 600;
      }
      main p {
        font-size: 16px;
        line-height: 1.6;
        margin: 16px 0;
      }
      .email-button {
        display: inline-block;
        margin: 24px auto;
        padding: 14px 28px;
        background-image: linear-gradient(to right, #7c3aed, #111827, #06b6d4);
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        transition: opacity 0.3s ease;
      }
      .email-button:hover {
        opacity: 0.9;
      }
      footer {
        text-align: center;
        font-size: 13px;
        color: #999999;
        background-color: #f4f4f7;
        padding: 20px 32px;
      }
      footer a {
        color: #4f46e5;
        text-decoration: none;
        margin: 0 6px;
      }
      @media only screen and (max-width: 600px) {
        main {
          padding: 24px 20px;
        }
        .email-button {
          width: 100%;
          box-sizing: border-box;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="logo">
        <img
          src="https://res.cloudinary.com/djtww0vax/image/upload/v1747766773/xi-biooid_bstapi.jpg"
          alt="Biooids Banner"
        />
      </div>
      <p>Biooids — the future is among us.</p>
    </header>
    <main>
      <h1>${content.title}</h1>
      ${content.body}
      ${buttonHtml}
    </main>
    <footer>
      <p>© ${year} Biooids. All rights reserved.</p>
      <p>
        <a href="https://biooids.com">Website</a> |
        <a href="https://biooids.com/terms">Terms</a> |
        <a href="https://biooids.com/privacy">Privacy</a>
      </p>
    </footer>
  </body>
</html>
`;
};
