import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// Define the steps separately
const getHackerNewsArticles = createStep({
  id: "getHackerNewsArticles",
  description: "Gets the top 20 stories from Hacker News",
  inputSchema: z.object({}),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ mastra }) => {
    const agent = mastra.getAgent("personalAssistantAgent");
    const hnPrompt = `
      Fetch the top 20 stories from Hacker News.
      After retreiving the top stories, only return stories that fit into my interests as follows:
      - AI
      - Javascript
      - Typescript
      - Science

      Return a maximum of 5 stories after filtering based on my interests.
    `;
    const response = await agent.generate(
      [{ role: "user", content: hnPrompt }],
      { maxSteps: 5 }
    );
    console.log("result hn", response);
    return {
      message: response.text,
    };
  },
});

const summarizeMastraPRs = createStep({
  id: "summarizeMastraPRs",
  description: "Summarizes the last 10 PRs from the @mastra-ai/mastra repo",
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ mastra }) => {
    const agent = mastra.getAgent("personalAssistantAgent");
    const githubPrompt = `
      Fetch the last 10 PRs from the @mastra-ai/mastra repo sorting by date descending.
      After retreiving the PRs, provide a few paragraph summary of what changes are being made.
    `;
    const response = await agent.generate(
      [{ role: "user", content: githubPrompt }],
      { maxSteps: 5 }
    );
    console.log("result prs", response);
    return {
      message: response.text,
    };
  },
});

const combineMessages = createStep({
  id: "combineMessages",
  description: "Combines the messages from the hacker news and mastra PRs",
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ getStepResult }) => {
    const hackerNews = getStepResult(getHackerNewsArticles);
    console.log("hackerNews", hackerNews);
    const mastraPRs = getStepResult(summarizeMastraPRs);
    console.log("mastraPRs", mastraPRs);
    //console.log("result combine", { hackerNews?.message, mastraPRs?.message });
    return {
      message: `${hackerNews.message}\n\n${mastraPRs.message}`,
    };
  },
});

// Create the workflow
export const dailyWorkflow = createWorkflow({
  id: "daily-workflow",
  description: "Daily workflow",
  inputSchema: z.object({}),
  outputSchema: z.object({}),
});

// Add steps to the workflow
dailyWorkflow
  .then(getHackerNewsArticles)
  .then(summarizeMastraPRs)
  .then(combineMessages)
  .commit();
