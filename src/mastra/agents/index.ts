import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { MCPConfiguration } from "@mastra/mcp";
import path from "path";
import { weatherTool } from "../tools";

const mcp = new MCPConfiguration({
  servers: {
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ""),
    },
    github: {
      url: new URL(process.env.COMPOSIO_MCP_GITHUB || ""),
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
  options: {
    // Keep last 20 messages in context
    lastMessages: 20,
    // Enable semantic search to find relevant past conversations
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
    // Enable working memory to remember user information
    workingMemory: {
      enabled: true,
      template: `<user>
         <first_name></first_name>
         <username></username>
         <preferences></preferences>
         <interests></interests>
         <conversation_style></conversation_style>
       </user>`,
      use: "tool-call",
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
         - You can use that to store info for later use or organize info for the user.
         - You can use this notes directory to keep track of to do list items for the user.
         - Notes dir: ${path.join(process.cwd(), `notes`)}

      
      Keep your responses concise and friendly.

      You have access to conversation memory and can remember details about users.
      When you learn something about a user, update their working memory using the appropriate tool.
      This includes:
      - Their interests
      - Their preferences
      - Their conversation style (formal, casual, etc.)
      - Any other relevant information that would help personalize the conversation

      Always maintain a helpful and professional tone.
      Use the stored information to provide more personalized responses.

   
  `,
  model: openai("gpt-4o"),
  tools: { ...mcpTools, weatherTool },
  memory,
});
