import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
      You are a helpful personal assistant that can help with the weather.
  `,
  model: openai("gpt-4o"),
  tools: { weatherTool },
});
