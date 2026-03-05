
import fs from "node:fs";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

async function fetchInternetContext(query) {
  try {
    const res = await client.responses.create({
      model: "gpt-5",
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

const res = await client.responses.create({
  model: "gpt-5.2-codex",
  input: prompt
})

const text = res.output_text || ""
const data = parseGeneratedJson(text)

if (!data?.app_jsx || !data?.app_css) {
  console.error("Error: model response JSON is missing app_jsx or app_css.");
  process.exit(1);
}

fs.writeFileSync("src/App.jsx", data.app_jsx)
fs.writeFileSync("src/App.css", data.app_css)

console.log("Website generated.")
}

run()
