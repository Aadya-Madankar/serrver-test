import type { AgentConfig } from './agent.types';
import { raniAgentConfig } from './configs/rani.agent.config';

// In a real application, you might dynamically load all configs from the directory.
// For this environment, we'll import them manually.
const allAgents: AgentConfig[] = [
    raniAgentConfig,
    // Add other agent configs here as you create them
    // e.g., import { vikramAgentConfig } from './configs/vikram.agent.config';
];

// Create a map for efficient lookups by agent name
export const agentRegistry = new Map<string, AgentConfig>(
    allAgents.map(agent => [agent.name, agent])
);
