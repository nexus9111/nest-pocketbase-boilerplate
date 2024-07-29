interface IEnv {
  APP_PORT: string;
  ENVIRONMENT: string;
  SERVICE_NAME: string;
  JWT_SECRET: string;

  POCKETBASE_ADMIN_URL: string;
  POCKETBASE_ADMIN_EMAIL: string;
  POCKETBASE_ADMIN_PASSWORD: string;
}

export const env = (): { env: IEnv } => ({
  env: {
    APP_PORT: process.env.APP_PORT,
    ENVIRONMENT: process.env.ENVIRONMENT,
    SERVICE_NAME: process.env.SERVICE_NAME,
    JWT_SECRET: process.env.JWT_SECRET,

    POCKETBASE_ADMIN_URL: process.env.POCKETBASE_ADMIN_URL,
    POCKETBASE_ADMIN_EMAIL: process.env.POCKETBASE_ADMIN_EMAIL,
    POCKETBASE_ADMIN_PASSWORD: process.env.POCKETBASE_ADMIN_PASSWORD,
  },
});

export { IEnv };
