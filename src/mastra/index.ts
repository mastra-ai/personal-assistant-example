import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { blogPostGeneratorAgent, tweetGhostwriterAgent } from "./agents";
import { dailyWorkflow } from "./workflows";

export const mastra: Mastra = new Mastra({
  agents: {
    blogPostGeneratorAgent,
    tweetGhostwriterAgent,
  },
  workflows: {
    dailyWorkflow,
  },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
