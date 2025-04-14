import { mastra } from "../index"; 
import { createTool, ToolExecutionContext } from "@mastra/core/tools";
import { MCPConfiguration } from "@mastra/mcp";
import { z } from "zod";

// interface GeocodingResponse {
//   results: {
//     latitude: number;
//     longitude: number;
//     name: string;
//   }[];
// }
// interface WeatherResponse {
//   current: {
//     time: string;
//     temperature_2m: number;
//     apparent_temperature: number;
//     relative_humidity_2m: number;
//     wind_speed_10m: number;
//     wind_gusts_10m: number;
//     weather_code: number;
//   };
// }

// interface BlogPost {
//   title: string;
//   content: string;
//   tags: string[];
// }

// export const weatherTool = createTool({
//   id: "get-weather",
//   description: "Get current weather for a location",
//   inputSchema: z.object({
//     location: z.string().describe("City name"),
//   }),
//   outputSchema: z.object({
//     temperature: z.number(),
//     feelsLike: z.number(),
//     humidity: z.number(),
//     windSpeed: z.number(),
//     windGust: z.number(),
//     conditions: z.string(),
//     location: z.string(),
//   }),
//   execute: async ({ context }) => {
//     return await getWeather(context.location);
//   },
// });

// const getWeather = async (location: string) => {
//   const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
//     location
//   )}&count=1`;
//   const geocodingResponse = await fetch(geocodingUrl);
//   const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

//   if (!geocodingData.results?.[0]) {
//     throw new Error(`Location '${location}' not found`);
//   }

//   const { latitude, longitude, name } = geocodingData.results[0];

//   const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

//   const response = await fetch(weatherUrl);
//   const data = (await response.json()) as WeatherResponse;

//   return {
//     temperature: data.current.temperature_2m,
//     feelsLike: data.current.apparent_temperature,
//     humidity: data.current.relative_humidity_2m,
//     windSpeed: data.current.wind_speed_10m,
//     windGust: data.current.wind_gusts_10m,
//     conditions: getWeatherCondition(data.current.weather_code),
//     location: name,
//   };
// };

// function getWeatherCondition(code: number): string {
//   const conditions: Record<number, string> = {
//     0: "Clear sky",
//     1: "Mainly clear",
//     2: "Partly cloudy",
//     3: "Overcast",
//     45: "Foggy",
//     48: "Depositing rime fog",
//     51: "Light drizzle",
//     53: "Moderate drizzle",
//     55: "Dense drizzle",
//     56: "Light freezing drizzle",
//     57: "Dense freezing drizzle",
//     61: "Slight rain",
//     63: "Moderate rain",
//     65: "Heavy rain",
//     66: "Light freezing rain",
//     67: "Heavy freezing rain",
//     71: "Slight snow fall",
//     73: "Moderate snow fall",
//     75: "Heavy snow fall",
//     77: "Snow grains",
//     80: "Slight rain showers",
//     81: "Moderate rain showers",
//     82: "Violent rain showers",
//     85: "Slight snow showers",
//     86: "Heavy snow showers",
//     95: "Thunderstorm",
//     96: "Thunderstorm with slight hail",
//     99: "Thunderstorm with heavy hail",
//   };
//   return conditions[code] || "Unknown";
// }


     

// export const dailyWorkflowTool = createTool({
//   id: "daily-workflow-tool",
//   description:
//     "Runs the daily workflow task which returns a summary of news and github activity",

//   outputSchema: z.object({
//     message: z.string(),
//   }),
//   execute: async ({ context }) => {
//     const { runId, start } = mastra.getWorkflow("dailyWorkflow").createRun();
//     const result = await start();
//     return {
//       message: result?.result?.message || "",
//     };
//   },
// });

// interface BlogPost {
//   title: string;
//   content: string;
//   tags: string[];
//   publishDate: string;
//   author: string;
// }

// export const scrapeBlogPostsTool = createTool({
//   id: "scrape-blog-posts",
//   description: "Scrapes specified blog posts from the Mastra website",
//   inputSchema: z.object({
//     urls: z.array(z.string()).describe("Array of blog post URLs to scrape"),
//   }),
//   outputSchema: z.object({
//     posts: z.array(
//       z.object({
//         title: z.string(),
//         content: z.string(),
//         tags: z.array(z.string()),
//         publishDate: z.string(),
//         author: z.string(),
//       })
//     ),
//   }),
//   execute: async ({ context }) => {
//     const posts: BlogPost[] = [];

//     for (const url of context.urls) {
//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
//         }

//         const html = await response.text();
        
//         // Parse the HTML content using regex or DOM parser
//         // This is a simplified example - you might want to use a proper HTML parser
//         const post: BlogPost = {
//           title: extractTitle(html),
//           content: extractContent(html),
//           tags: extractTags(html),
//           publishDate: extractPublishDate(html),
//           author: extractAuthor(html),
//         };

//         posts.push(post);
//       } catch (error) {
//         console.error(`Error scraping ${url}:`, error);
//       }
//     }

//     return { posts };
//   },
// });

// function extractTitle(html: string): string {
//   // Implement title extraction logic
//   const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
//   return titleMatch ? titleMatch[1].trim() : "";
// }

// function extractContent(html: string): string {
//   // Implement content extraction logic
//   const contentMatch = html.match(/<article[^>]*>(.*?)<\/article>/s);
//   return contentMatch ? cleanHtml(contentMatch[1]) : "";
// }

// function extractTags(html: string): string[] {
//   // Implement tags extraction logic
//   const tagsMatch = html.match(/<div class="tags">(.*?)<\/div>/s);
//   if (!tagsMatch) return [];
  
//   const tags = tagsMatch[1].match(/<span[^>]*>(.*?)<\/span>/g) || [];
//   return tags.map(tag => tag.replace(/<[^>]*>/g, "").trim());
// }

// function extractPublishDate(html: string): string {
//   // Implement publish date extraction logic
//   const dateMatch = html.match(/<time[^>]*>(.*?)<\/time>/);
//   return dateMatch ? dateMatch[1].trim() : "";
// }

// function extractAuthor(html: string): string {
//   // Implement author extraction logic
//   const authorMatch = html.match(/<span class="author"[^>]*>(.*?)<\/span>/);
//   return authorMatch ? authorMatch[1].trim() : "";
// }

// function cleanHtml(html: string): string {
//   // Remove HTML tags and clean up the content
//   return html
//     .replace(/<[^>]*>/g, "") // Remove HTML tags
//     .replace(/\s+/g, " ") // Replace multiple spaces with single space
//     .trim();
// }

// interface MastraBlogPost {
//   title: string;
//   content: string;
//   author: string;
//   date: string;
//   tags: string[];
//   url: string;
// }

// export const scrapeMastraBlogPostsTool = createTool({
//   id: "scrape-mastra-blog-posts",
//   description: "Scrapes specific blog posts from the Mastra website",
//   inputSchema: z.object({
//     urls: z.array(z.string()).describe("Array of Mastra blog post URLs to scrape"),
//   }),
//   outputSchema: z.object({
//     posts: z.array(
//       z.object({
//         title: z.string(),
//         content: z.string(),
//         author: z.string(),
//         date: z.string(),
//         tags: z.array(z.string()),
//         url: z.string(),
//       })
//     ),
//   }),
//   execute: async ({ context }) => {
//     const posts: MastraBlogPost[] = [];

//     for (const url of context.urls) {
//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
//         }

//         const html = await response.text();
//         const post = extractBlogPost(html, url);
//         posts.push(post);
//       } catch (error) {
//         console.error(`Error scraping ${url}:`, error);
//       }
//     }

//     return { posts };
//   },
// });

// function extractBlogPost(html: string, url: string): MastraBlogPost {
//   // Extract title (format: # Title)
//   const titleMatch = html.match(/# ([^\n]+)/);
//   const title = titleMatch ? titleMatch[1].trim() : "";

//   // Extract date (format: Mar 26, 2025)
//   const dateMatch = html.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);
//   const date = dateMatch ? dateMatch[1] : "";

//   // Extract tags (format: \# tag1\# tag2)
//   const tagsMatch = html.match(/\\# ([^\n]+)/);
//   const tags = tagsMatch 
//     ? tagsMatch[1].split('\\#').map(tag => tag.trim()).filter(Boolean)
//     : [];

//   // Extract author (format: SBName Surname)
//   const authorMatch = html.match(/SB([^\n]+)/);
//   const author = authorMatch ? authorMatch[1].trim() : "";

//   // Extract content (everything between title and author section)
//   const contentMatch = html.match(/# [^\n]+\n\n([\s\S]+?)\n\n### Author/);
//   const content = contentMatch ? contentMatch[1].trim() : "";

//   return {
//     title,
//     content,
//     author,
//     date,
//     tags,
//     url,
//   };
// }

// const result = await scrapeMastraBlogPostsTool!.execute({ 
//   context: {
//     urls: [
//       "https://mastra.ai/blog/speech-to-speech",
//       "https://mastra.ai/blog/introducing-mastra-mcp",
//       "https://mastra.ai/blog/whiteboard-to-excalidraw-converter"
//     ]
//   }
// });
