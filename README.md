# Personal Assistant Agent

An example personal assistant built with Mastra and MCP (Model Context Protocol) that helps with various daily tasks and information management.

## Features

This personal assistant can help with:

- **Email Management**: Read, categorize, and send emails through Gmail
- **GitHub Activity**: Monitor and summarize GitHub activity, including PRs and commits
- **Social Media Scheduling**: Create and manage tweet drafts with Typefully
- **Weather Information**: Get current weather conditions for any location
- **Hacker News**: Search for and retrieve stories and comments from Hacker News
- **Todo Lists**: Keep track of tasks and important items using the filesystem
- **Daily Workflow**: Run automated workflows to get summaries of news and GitHub activity

## How It Works

The personal assistant is built using Mastra's agent framework and leverages MCP servers to connect to various services.

### Agent Architecture

The core of the application is the `personalAssistantAgent` which:

- Uses GPT-4o as its underlying model
- Has access to various tools through MCP connections
- Maintains memory of conversations and user preferences
- Can execute workflows for complex, multi-step tasks

### MCP Servers

The assistant connects to several MCP servers:

- Zapier: For automation and connecting to various services
- GitHub: For monitoring repository activity
- Hacker News: For retrieving tech news
- Text Editor: For managing notes and todo lists

### Tools

The assistant includes custom tools like:

- Weather Tool: Fetches current weather conditions using open-meteo API
- Daily Workflow Tool: Runs a sequence of steps to gather and summarize information

### Workflows

The application includes a daily workflow that:

1. Fetches relevant Hacker News stories based on user interests
2. Summarizes recent PRs from the Mastra repository
3. Combines this information into a daily briefing

### Telegram Bot

The application connects with a Telegram bot to handle user interactions and provide responses.

- The code for this bot is in `src/mastra/integrations/telegram.ts` and it's used in `src/mastra/index.ts`.
- You can get your Telegram bot token from [BotFather](https://t.me/BotFather).

## Getting Started

1. Clone this repository
2. Create a `.env.development` file with the required API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ZAPIER_MCP_URL=your_zapier_mcp_url
   COMPOSIO_MCP_GITHUB=your_github_mcp_url
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```
3. Install dependencies:
   ```
   pnpm install
   ```
4. Run the dev playground:
   ```
   pnpm run dev
   ```

## Customization

You can customize the assistant by:

- Modifying the agent instructions in `src/mastra/agents/index.ts`
- Adding new tools in `src/mastra/tools/index.ts`
- Creating new workflows in `src/mastra/workflows/index.ts`
- Adjusting memory settings for better personalization

## Dependencies

- `@ai-sdk/openai`: For connecting to OpenAI models
- `@mastra/core`: Core Mastra functionality
- `@mastra/memory`: For conversation and working memory
- `@mastra/mcp`: For Model Context Protocol integration
- `zod`: For schema validation

## Notes

This assistant uses a notes directory to store information for later use. The notes can be used to keep track of todo list items and other important information that should persist between sessions.
