import { AIMessage, BaseMessage, HumanMessage, ToolMessage, SystemMessage } from "@langchain/core/messages";
import { AIMessageChunk } from "@langchain/core/messages";
import { agentGraph } from "../../agents/graph";
import type { ChatMessage, StreamResponse } from "../../types";
import type { AgentConfig } from "../../agents/agent.types";

/**
 * Converts the application's chat history format to the format expected by LangChain.
 */
function formatHistory(history: ChatMessage[]): BaseMessage[] {
  return history.map((msg) => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.parts[0].text);
    } else {
      return new AIMessage(msg.parts[0].text);
    }
  });
}

export async function* generateChatStream(
  agentConfig: AgentConfig,
  prompt: string,
  history: ChatMessage[],
): AsyncGenerator<StreamResponse> {
  try {
    const formattedHistory = formatHistory(history);
    
    // Add system prompt with Rani's personality
    const systemMessage = new SystemMessage(agentConfig.chatPrompt);
    
    const stream = await agentGraph.stream(
      { messages: [systemMessage, ...formattedHistory, new HumanMessage(prompt)] },
      { recursionLimit: 10 }
    );

    for await (const chunk of stream) {
      const agentNode = chunk['agent'];
      if (agentNode) {
        const message = agentNode.messages[agentNode.messages.length - 1];
        if (message instanceof AIMessageChunk) {
          yield { textChunk: message.content as string };
        } else if (message instanceof AIMessage && message.content) {
          yield { textChunk: message.content as string };
        }
      }
      

    }
  } catch (error) {
    console.error(`❌ Error in [${agentConfig.name}] agent generation:`, error);
    yield { textChunk: "Apologies, I seem to be having trouble connecting. Let's try again in a moment." };
  }
}
