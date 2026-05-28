
import fs from "node:fs";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const defaultModelCandidates = ["gpt-5", "gpt-5-mini", "gpt-4.1", "gpt-4.1-mini"];
const configuredModel = (process.env.OPENAI_MODEL || "").trim();
const modelCandidates = configuredModel
  ? [configuredModel, ...defaultModelCandidates.filter((model) => model !== configuredModel)]
  : defaultModelCandidates;

function parseGeneratedJson(text) {
  try {
    return JSON.parse(text);
  } catch (_err) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Model response did not contain JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function indentBlock(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
}

function normalizeAppJsx(appJsx) {
  const trimmed = appJsx.trim();
  const hasReactImport = /from\s+["']react["']/.test(trimmed) || /require\(["']react["']\)/.test(trimmed);
  const reactImportPrefix = hasReactImport ? "" : 'import React from "react";\n\n';

  if (!trimmed) {
    throw new Error("Generated app_jsx was empty.");
  }

  if (/export\s+default/m.test(trimmed)) {
    return `${reactImportPrefix}${trimmed}\n`;
  }

  if (/\b(function|const|class)\s+App\b/m.test(trimmed)) {
    return `${reactImportPrefix}${trimmed}\n\nexport default App;\n`;
  }

  return `${reactImportPrefix}export default function App() {\n  return (\n    <>\n${indentBlock(trimmed, 6)}\n    </>\n  );\n}\n`;
}

function isModelAccessError(err) {
  return (
    err?.status === 403 ||
    err?.code === "model_not_found" ||
    /does not have access to model/i.test(err?.message || "")
  );
}

async function fetchInternetContext(query) {
  try {
    const res = await client.responses.create({
      model: process.env.OPENAI_WEB_MODEL || "gpt-5",
      tools: [{ type: "web_search_preview" }],
      input: `Search the web for recent, relevant information for this website request:
"${query}"

Return only concise bullet points with useful content we can include on a landing page.
Focus on: organization details, services, location/coverage, trust signals, and relevant facts.
Keep it factual and avoid speculation.`
    });
    return (res.output_text || "").trim();
  } catch (err) {
    console.warn("Warning: web search step failed, proceeding without internet context.");
    return "";
  }
}

async function generateSiteJson(prompt) {
  let lastError;

  for (const model of modelCandidates) {
    try {
      const res = await client.responses.create({
        model,
        input: prompt
      });

      return {
        model,
        text: res.output_text || ""
      };
    } catch (err) {
      if (!isModelAccessError(err)) {
        throw err;
      }

      lastError = err;
      console.warn(`Warning: OpenAI model "${model}" is unavailable for this project. Trying next fallback...`);
    }
  }

  throw lastError || new Error("No OpenAI model could be used for site generation.");
}

async function run(){
const inputPrompt = process.argv.slice(2).join(" ").trim();
const requiredAppJsx = (process.env.REQUIRED_APP_JSX || "").trim();
const requiredWhatsappNumber = (process.env.REQUIRED_WHATSAPP_NUMBER || "").trim();

if (!inputPrompt) {
  console.error("Error: prompt string is required.");
  process.exit(1);
}

if (!requiredWhatsappNumber) {
  console.error("Error: WhatsApp number is required via REQUIRED_WHATSAPP_NUMBER.");
  process.exit(1);
}

const internetContext = await fetchInternetContext(inputPrompt);
const promptBase = inputPrompt;
const prompt = `${promptBase}

${internetContext ? `Use this internet-researched context to add richer, concrete content:
${internetContext}` : ""}

${requiredAppJsx ? `Must include this exact JSX snippet somewhere in app_jsx:
${requiredAppJsx}

Use WhatsApp number ${requiredWhatsappNumber} for any WhatsApp link/button.` : ""}

Return only valid JSON. No markdown, no explanation.
JSON shape:
{
  "app_jsx": "string",
  "app_css": "string"
}`;

const { model, text } = await generateSiteJson(prompt);
const data = parseGeneratedJson(text)

if (!data?.app_jsx || !data?.app_css) {
  console.error("Error: model response JSON is missing app_jsx or app_css.");
  process.exit(1);
}

fs.writeFileSync("src/App.jsx", normalizeAppJsx(data.app_jsx))
fs.writeFileSync("src/App.css", data.app_css)

console.log(`Website generated using model: ${model}`)
}

run()
