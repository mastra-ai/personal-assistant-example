import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { mastra } from "../";

// Define the steps separately
const getHackerNewsArticles = new Step({
  id: "getHackerNewsArticles",
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ context }) => {
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

const summarizeMastraPRs = new Step({
  id: "summarizeMastraPRs",
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ context }) => {
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

const combineMessages = new Step({
  id: "combineMessages",
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const hackerNews = context.getStepResult("getHackerNewsArticles");
    const mastraPRs = context.getStepResult("summarizeMastraPRs");
    console.log("result combine", { hackerNews, mastraPRs });
    return {
      message: `${hackerNews.message}\n\n${mastraPRs.message}`,
    };
  },
});

// Create the workflow
export const dailyWorkflow = new Workflow({
  name: "daily-workflow",
});

// Add steps to the workflow
dailyWorkflow
  .step(getHackerNewsArticles)
  .then(summarizeMastraPRs)
  .then(combineMessages)
  .commit();
