import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools";
import { Memory } from "@mastra/memory";
import { MCPClient } from "@mastra/mcp";
import path from "path";
import { LibSQLStore } from "@mastra/libsql";
import { dailyWorkflow } from "../workflows";

const mcp = new MCPClient({
  servers: {
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ""),
    },
    github: {
      url: new URL("https://api.githubcopilot.com/mcp"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    },
    hackernews: {
      command: "npx",
      args: ["-y", "@devabdultech/hn-mcp-server"],
    },
    textEditor: {
      command: "pnpx",
      args: [
        `@modelcontextprotocol/server-filesystem`,
        path.join(process.cwd(), "../", "../", "notes"),
      ],
    },
  },
});

const mcpTools = await mcp.getTools();

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../mastra.db", // Or your database URL
  }),
  options: {
    // Keep last 20 messages in context
    lastMessages: 20,
    workingMemory: {
      enabled: true,
      template: `<user>
          <first_name></first_name>
          <username></username>
          <preferences></preferences>
          <interests></interests>
          <conversation_style></conversation_style>
        </user>`,
    },
  },
});

export const personalAssistantAgent = new Agent({
  name: "Personal Assistant",
  instructions: `
      You are a helpful personal assistant that can help with various tasks such as email, 
      monitoring github activity, scheduling social media posts and providing weather information.
      
      You have access to the following tools:
      
      1. Gmail:
         - Use these tools for reading and categorizing emails from Gmail
         - You can categorize emails by priority, identify action items, and summarize content
         - You can also use this tool to send emails
      
      2. GitHub:
         - Use these tools for monitoring and summarizing GitHub activity
         - You can summarize recent commits, pull requests, issues, and development patterns
      
      3. Typefully:
         - Use these tools for 
         - It can also create and manage tweet drafts with Typefully
         - It focuses on AI, Javascript, Typescript, and Science topics
      
      4. Weather:
         - Use this tool for getting weather information for specific locations
         - It can provide details like temperature, humidity, wind conditions, and weather conditions
         - Always ask for the location or if it's not provided try to use your working memory 
           to get the user's last requested location

      5. Hackernews:
         - Use this tool to search for stories on Hackernews
         - You can use it to get the top stories or specific stories
         - You can use it to retrieve comments for stories

      6. Daily Workflow:
         - Use this tool to run the daily workflow which returns a summary of news and github activity

      7. Filesystem:
         - You also have filesystem read/write access to a notes directory. 
         - You can use that to store information such as reminders for later use or organize info for the user.
         - You can use this notes directory to keep track of to do list items for the user.
         - Notes dir: ${path.join(process.cwd(), `notes`)}
  `,
  model: openai("gpt-4o"),
  tools: { ...mcpTools, weatherTool },
  workflows: {
    dailyWorkflow,
  },
  memory,
});
