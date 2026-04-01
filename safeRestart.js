import { exec } from "node:child_process";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is missing in .env");
  process.exit(1);
}

console.log("OPENAI_API_KEY found. Starting backend...");

const child = exec("node server.js");

child.stdout.on("data", (data) => process.stdout.write(data));
child.stderr.on("data", (data) => process.stderr.write(data));

child.on("exit", (code) => {
  console.log(`Backend exited with code ${code}`);
});
