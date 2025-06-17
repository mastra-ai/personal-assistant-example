import { Mastra } from "@mastra/core/mastra";
import { ConsoleLogger } from "@mastra/core/logger";
import { TelegramIntegration } from "./integrations/telegram";
import { personalAssistantAgent } from "./agents/personalAssistantAgent";
import { dailyWorkflow } from "./workflows";
import { LibSQLStore } from "@mastra/libsql";

export const mastra: Mastra = new Mastra({
  agents: {
    personalAssistantAgent,
  },
  workflows: {
    dailyWorkflow,
  },
  logger: new ConsoleLogger(),
  storage: new LibSQLStore({
    url: "file:./mastra.db",
  }),
});

// Initialize Telegram bot if token is available
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set in environment variables");
  process.exit(1);
}

// Start the Telegram bot
export const telegramBot = new TelegramIntegration(TELEGRAM_BOT_TOKEN);
