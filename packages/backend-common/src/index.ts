import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// Equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export const JWT_SECRET = process.env.JWT_SECRET;
