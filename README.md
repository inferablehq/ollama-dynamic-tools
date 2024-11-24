# Dynamic Tool Attachment Project

A TypeScript-based project demonstrating dynamic tool attachment using in-memory RAG (Retrieval-Augmented Generation).
This project shows how to dynamically select and attach relevant tools to an LLM based on user input using semantic search.

Uses Ollama as the LLM provider with [llama3.2 3b](https://ollama.com/library/llama3.2). This is a companion project to the [Dynamic Tool Attachment](https://inferable.ai/blog/dynamic-tools) blog post.

## How it Works

The project embeds tool descriptions using the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model and matches user queries to the most relevant tools using [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity).
This allows for dynamic, context-aware tool selection during conversations.

## Prerequisites

- Node.js and npm installed
- Ollama running locally with the [llama3.2 (3b)](https://ollama.com/library/llama3.2) and [nomic-embed-text](https://ollama.com/library/nomic-embed-text) models

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure Ollama is running with the required models

## Usage

Run the project:
```bash
tsx index.ts
```

Enter messages in the console to interact with the LLM. The system will automatically attach the most relevant tools based on your input.

```bash
Enter your message:
find hammer with ID 123
Attaching tool: { tool: 'findTool', similarity: 0.5955042990419085 }
Attaching tool: { tool: 'findToy', similarity: 0.5411030864968827 }
Attaching tool: { tool: 'findMovie', similarity: 0.5219368182792513 }
Attaching tool: { tool: 'findSong', similarity: 0.5155495695032712 }
Attaching tool: { tool: 'findCar', similarity: 0.5132604044773412 }
Tools called:  [ { function: { name: 'findTool', arguments: [Object] } } ]
```

## License

This project is licensed under the MIT License.
