import { ALL_TOOLS } from "./tools";

import readline from "readline";
import similarity from "compute-cosine-similarity";

type Message = {
  role: "user" | "assistant";
  content: string;
}

type Tool = {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: unknown;
  }
}

type EmbededTool = {
  tool: Tool;
  embedding: number[];
}

const ollamaChat = async (messages: Message[], tools: Tool[]) => {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      messages,
      tools,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.message;
}

const ollamaEmbed = async (input: string) => {
  const response = await fetch("http://localhost:11434/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      input,
    }),
  });

  const data = await response.json();
  return data.embeddings[0];
}

const computeToolEmbeddings = async (tools: Tool[]) => Promise.all(
  tools.map(async (tool) => {
    const embedding = await ollamaEmbed(`${tool.function.name}: ${tool.function?.description}`)

    return {
      tool,
      embedding,
    }
  })
)

const searchTools = async (input: string, embeddings: EmbededTool[]) => {
  const messageEmbedding = await ollamaEmbed(input);

  const found = embeddings
    .map((embedding) => ({
      tool: embedding.tool,
      similarity: similarity(embedding.embedding, messageEmbedding)!
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  found.forEach((tool) => {
    console.log(`Attaching tool:`, {
      tool: tool.tool.function.name,
      similarity: tool.similarity
    });
  })

  return found.map((tool) => tool.tool);
}

const main = async () =>{
  console.log("Embedding tools...");
  const embeddings = await computeToolEmbeddings(ALL_TOOLS);
  console.log("Tools embedded.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Enter your message:");
  let messages: Message[] = []
  rl.on('line', async (input) => {
    const attachedTools = await searchTools(input, embeddings);

    messages.push({ role: "user", content: input })
    const response = await ollamaChat(messages, attachedTools);
    messages.push({ role: "assistant", content: response.content })

    console.log("Tools called:", response.content, response.tool_calls)
  })
}

main();
