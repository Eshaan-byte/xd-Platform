import "dotenv/config";
import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

let isConnected = false;

async function ensureConnection() {
  if (!isConnected) {
    await connectDatabase();
    isConnected = true;
  }
}

export default async function handler(req: any, res: any) {
  await ensureConnection();
  return app(req, res);
}
