import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { validateEnv } from "./utils/env";

const env = validateEnv();
const app = createApp(env.CLIENT_URL);

app.listen(Number(env.PORT), () => {
  console.log(`\n🚀 Server running on http://localhost:${env.PORT}`);
  console.log(`📋 Health check: http://localhost:${env.PORT}/api/health`);
  console.log(`🌐 CORS origin: ${env.CLIENT_URL}`);
  console.log(`🔧 Environment: ${env.NODE_ENV}\n`);
});
