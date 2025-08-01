// FILE: server/src/config/index.ts (Updated)

/**
 * Helper to get and validate environment variables.
 * Throws an error if a required variable is missing.
 */
const getEnvVariable = (key: string, required: boolean = true): string => {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(
      `❌ Fatal Error: Missing required environment variable ${key}. Check your .env file or platform settings.`
    );
  }
  return value || "";
};

/**
 * Helper to get and validate environment variables as integers.
 * Throws an error for missing or invalid values.
 */
const getEnvVariableAsInt = (
  key: string,
  required: boolean = true,
  defaultValue?: number
): number => {
  const valueStr = process.env[key];

  if (!valueStr) {
    if (required && defaultValue === undefined) {
      throw new Error(
        `❌ Fatal Error: Missing required environment variable ${key}.`
      );
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return NaN;
  }

  const intValue = parseInt(valueStr, 10);

  if (isNaN(intValue)) {
    throw new Error(
      `❌ Fatal Error: Invalid integer format for environment variable ${key}. Value: "${valueStr}"`
    );
  }
  return intValue;
};

// Define the structure of your configuration
interface Config {
  nodeEnv: "development" | "production" | "test";
  port: number;
  databaseUrl: string;
  corsOrigin: string;
  jwt: {
    accessSecret: string;
    accessExpiresInSeconds: number;
    refreshSecret: string;
    refreshExpiresInDays: number;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  cookies: {
    refreshTokenName: string;
  };
  logLevel: string;
  // --- ADDED: Mailgun and Frontend URL config ---
  mailgun: {
    apiKey: string;
    domain: string;
  };
  frontendUrl: string;
}

let config: Config;

try {
  config = {
    nodeEnv: getEnvVariable("NODE_ENV", true) as
      | "development"
      | "production"
      | "test",
    port: getEnvVariableAsInt("PORT", true),
    databaseUrl: getEnvVariable("DATABASE_URL", true),
    corsOrigin: getEnvVariable("CORS_ORIGIN", true),

    jwt: {
      accessSecret: getEnvVariable("ACCESS_TOKEN_SECRET", true),
      accessExpiresInSeconds: getEnvVariableAsInt(
        "ACCESS_TOKEN_EXPIRES_IN_SECONDS",
        true
      ),
      refreshSecret: getEnvVariable("REFRESH_TOKEN_SECRET", true),
      refreshExpiresInDays: getEnvVariableAsInt(
        "REFRESH_TOKEN_EXPIRES_IN_DAYS",
        true
      ),
    },

    cloudinary: {
      cloudName: getEnvVariable("CLOUDINARY_CLOUD_NAME", true),
      apiKey: getEnvVariable("CLOUDINARY_API_KEY", true),
      apiSecret: getEnvVariable("CLOUDINARY_API_SECRET", true),
    },

    cookies: {
      refreshTokenName: "jid",
    },
    logLevel: getEnvVariable("LOG_LEVEL", false) || "info",

    // --- ADDED: Load new variables from .env ---
    mailgun: {
      apiKey: getEnvVariable("MAILGUN_API_KEY", true),
      domain: getEnvVariable("MAILGUN_DOMAIN", true),
    },
    frontendUrl: getEnvVariable("FRONTEND_URL", true),
  };
} catch (error) {
  console.error(
    "❌ Critical error during application configuration setup:",
    error
  );
  process.exit(1);
}

export { config };
