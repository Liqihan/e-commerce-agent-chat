import express from "express";
import { createServer as createViteServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import { unstable_v2_prompt, tool } from "@anthropic-ai/claude-agent-sdk";
import { mainImagePlanningSkill, marketInsightSkill } from "./skills";

// Register skills
const registeredSkills = {
  mainImagePlanning: mainImagePlanningSkill,
  marketInsight: marketInsightSkill
};

// Load .env.local first (if present), then fall back to .env.
dotenv.config({ path: ".env.local" });
dotenv.config();

const ANTHROPIC_API_KEY =
  process.env.ANTHROPIC_AUTH_TOKEN?.trim() ??
  "sk-rDvSOK68j4iCJ45vxgC9YhA1o5ZNkZ4UBA6gxX5yZIdR1Ej8";
const ANTHROPIC_BASE_URL =
  process.env.ANTHROPIC_BASE_URL ?? "https://aiberm.com";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function extractOutputText(data: any): string {
  const output = data?.output;
  if (!Array.isArray(output)) return "";

  for (const item of output) {
    if (item?.type !== "message" || item?.role !== "assistant" || !Array.isArray(item?.content)) {
      continue;
    }
    const parts = item.content
      .filter((c: any) => c?.type === "output_text" && typeof c.text === "string")
      .map((c: any) => c.text);
    if (parts.length > 0) {
      return parts.join("");
    }
  }

  return "";
}

function normalizeClaudeResult(result: any): string {
  const direct = result?.result;
  if (typeof direct === "string") {
    const match = direct.match(/result:\s*['"]([^'"]+)['"]/s);
    if (match?.[1]) return match[1];
    return direct;
  }
  if (direct && typeof direct === "object") {
    if (typeof direct.result === "string") return direct.result;
  }
  if (result && typeof result.content === "string") return result.content;
  const outputText = extractOutputText(result);
  if (outputText) return outputText;
  return "";
}

async function callClaude(messages: ChatMessage[]): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_AUTH_TOKEN is not set.");
  }

  // Extract the last user message as the task
  const lastMessage = messages[messages.length - 1]?.content || "";

  // Use Claude Agent SDK with skills
  const result = await unstable_v2_prompt(lastMessage, {
    apiKey: ANTHROPIC_API_KEY,
    baseUrl: ANTHROPIC_BASE_URL,
    tools: Object.values(registeredSkills)
  });

  const normalized = normalizeClaudeResult(result);
  return normalized || "抱歉，我暂时没有生成有效的回复。";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages payload" });
      }

      const normalizedMessages: ChatMessage[] = messages
        .filter((m: any) => m && typeof m.role === "string")
        .map((m: any) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        }));

      if (!ANTHROPIC_API_KEY) {
        return res.json({
          choices: [
            {
              message: {
                role: "assistant",
                content: "抱歉，当前未配置 Claude 访问密钥，请设置 ANTHROPIC_AUTH_TOKEN 后重试。",
              },
            },
          ],
        });
      }

      const responseContent = await callClaude(normalizedMessages);
      return res.json({
        choices: [
          {
            message: {
              role: "assistant",
              content: responseContent,
            },
          },
        ],
      });
    } catch (error) {
      console.error("Server Error:", error);
      return res.json({
        choices: [
          {
            message: {
              role: "assistant",
              content: "抱歉，服务暂时不可用，请稍后重试。",
            },
          },
        ],
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: false,
      plugins: [react(), tailwindcss()],
      define: {
        "process.env.GEMINI_API_KEY": JSON.stringify(process.env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          "@app": path.resolve(__dirname, "src"),
        },
      },
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving would go here
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
