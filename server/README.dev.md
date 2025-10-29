# Developer Notes: LangGraph for Advanced Agents

This document is for developers looking to understand the advanced capabilities of the AI agent server. The architecture uses a hybrid model:
1.  **Direct-to-Gemini (Live Voice Chat)**: For the lowest possible latency, the voice chat connects directly from the client to the Gemini Live API.
2.  **LangGraph-Powered (Text Chat)**: For the most intelligent and capable responses, the text chat is processed by a sophisticated reasoning engine built with LangGraph on the server.

---

## What is LangGraph?

**LangGraph** is a library for building stateful, multi-actor applications with LLMs. We use it to define a **flowchart or a state machine** for our AI's reasoning process. Instead of a single call to the LLM, LangGraph allows us to create loops, conditional branches, and steps where the AI can use tools (like Google Search) to gather information before giving a final answer.

This is what elevates the agent from a simple chatbot to a true AI assistant.

### Key Concepts

-   **Graph**: The overall flowchart that defines the agent's logic.
-   **State**: A central piece of data (in our case, the list of chat messages) that is passed between each step in the graph. Each step can modify the state.
-   **Nodes**: The "boxes" in the flowchart. A node is a function that performs an action, like calling the `gemini-2.5-pro` model or executing a tool.
-   **Edges**: The "arrows" connecting the nodes. Edges determine the next step in the flow. A *conditional edge* can direct the flow based on the current state (e.g., "Did the LLM decide to use a tool? If so, go to the Action Node. If not, finish.").

---

## 🚀 How LangGraph is Used for Chat

The core benefit of using LangGraph in our chat service is to give the agent the ability to use **tools**. A "tool" could be anything from our Google Search function to an internal API that fetches user data.

### Chat Workflow with LangGraph

Here’s how our agent processes a chat message. The core idea is a reasoning loop: **Agent -> Tool -> Agent -> ... -> Final Answer**.

```mermaid
graph TD
    A[Start: User sends a message] --> B{Agent State (Messages)};
    B --> C(<b>Agent Node</b><br/>`gemini-2.5-pro` decides what to do based on the conversation history.);
    C --> D{Does the agent want to use a tool?};
    D -- "Yes, call web-search" --> E(<b>Action Node</b><br/>Execute the search tool, get results.);
    E -- "Add results to state" --> B;
    D -- "No, just respond" --> F(<b>Final Response</b><br/>Stream the answer back to the user.);
    F --> G[End];
```

### Step-by-Step Implementation

1.  **Dependencies**: The server's `package.json` includes `langchain`, `@langchain/google-genai`, and `langgraph`.
2.  **Agent State (`graph.ts`)**: The state is defined as a list of LangChain `BaseMessage` objects, which tracks the conversation history.
3.  **Tools (`googleSearch.tool.ts`)**: We have defined a `web-search` tool. This tool uses the `gemini-2.5-flash` model with Google Search grounding to quickly fetch relevant information from the web.
4.  **Graph Definition (`graph.ts`)**:
    *   **Model**: We initialize the `gemini-2.5-pro` model with the maximum `thinkingBudget` and bind it to the available tools.
    *   **Nodes**: We define an `agent` node to call the LLM and an `action` node to execute tool calls.
    *   **Edges**: A conditional edge checks if the LLM's last response included a request to call a tool. If it did, the graph routes to the `action` node; otherwise, it ends the loop and provides the final response.
5.  **Service Integration (`chat.service.ts`)**: The chat service no longer calls the Gemini SDK directly. Instead, it:
    *   Formats the incoming chat history into the LangChain message format.
    *   Invokes the compiled `agentGraph` with the current conversation state.
    *   Streams the resulting events from the graph, parsing out the final AI message chunks and any sources from tool calls, and yields them to the client.

By following this architecture, we have created a chat agent that is not only conversational but also capable of reasoning, problem-solving, and accessing external information in real-time.