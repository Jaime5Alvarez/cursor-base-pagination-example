const requiredEnvVars = ["DATABASE_URL"] as const;

function getRequiredEnvVar(key: (typeof requiredEnvVars)[number]): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`The environment variable ${key} is not defined`);
  }
  return value;
}

export const { DATABASE_URL } = {
  DATABASE_URL: getRequiredEnvVar("DATABASE_URL"),
} as const;