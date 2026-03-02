import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";

const startServer = async (): Promise<void> => {
  try {
    logger.info("Starting server initialization...");

    await connectDatabase();

    // Firebase init (optional — only if configured)
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_PRIVATE_KEY && env.FIREBASE_CLIENT_EMAIL) {
      try {
        const { initializeFirebase } = await import("./config/firebase.js");
        initializeFirebase();
      } catch (error) {
        logger.warn({ error }, "Firebase initialization skipped (not configured)");
      }
    } else {
      logger.info("Firebase not configured — skipping initialization");
    }

    // S3 init (optional — only if configured)
    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.S3_BUCKET_NAME) {
      try {
        const { initializeS3 } = await import("./config/s3.js");
        await initializeS3();
      } catch (error) {
        logger.warn({ error }, "S3 initialization skipped (not configured)");
      }
    } else {
      logger.info("S3 not configured — skipping initialization");
    }

    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "Server started successfully",
      );
      logger.info(
        `API Documentation available at: http://localhost:${env.PORT}/api-docs`,
      );
      logger.info(`API Base URL: http://localhost:${env.PORT}/api/v1`);
    });

    const gracefulShutdown = (signal: string) => {
      logger.info({ signal }, "Received shutdown signal");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      logger.error({ error }, "Uncaught exception");
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error({ reason, promise }, "Unhandled rejection");
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

startServer();
