import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { webSearchTool } from "../tools/googleSearch.tool";
import { raniAgentConfig } from "./configs/rani.agent.config";
import dotenv from 'dotenv';

// Load environment variables BEFORE creating the model
dotenv.config();

// Define state using Annotation (required in LangGraph 0.2+)
const GraphAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  }),
});

// Model setup
const model = new ChatGoogleGenerativeAI({
  model: raniAgentConfig.model || 'gemini-2.5-pro',
  temperature: 0.7,
  apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY,
}).bindTools([webSearchTool]);

// Agent node
async function callAgent(state: typeof GraphAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// Tools node
async function callTools(state: typeof GraphAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  const toolResults = [];
  
  for (const toolCall of lastMessage.tool_calls || []) {
    const tool = webSearchTool;
    const result = await tool.invoke(toolCall.args);
    toolResults.push(
      new ToolMessage({
        content: result,
        tool_call_id: toolCall.id!,
      })
    );
  }
  
  return { messages: toolResults };
}

// Routing function
function shouldContinue(state: typeof GraphAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  
  return END;
}

// Build the graph
const workflow = new StateGraph(GraphAnnotation)
  .addNode("agent", callAgent)
  .addNode("tools", callTools)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

export const agentGraph = workflow.compile();
