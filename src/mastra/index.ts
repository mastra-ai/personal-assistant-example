import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { TelegramIntegration } from "./integrations/telegram";
import { personalAssistantAgent } from "./agents";
import { dailyWorkflow } from "./workflows";

export const mastra: Mastra = new Mastra({
  agents: {
    personalAssistantAgent,
  },
  workflows: {
    dailyWorkflow,
  },
  logger: createLogger({
    name: "Mastra",
    level: "info",
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
