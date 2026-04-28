'use server';
/**
 * @fileOverview Provides a natural language explanation for network threat classification and recommended adaptive actions.
 *
 * - explainThreatDecision - A function that handles the explanation process.
 * - ExplainThreatDecisionInput - The input type for the explainThreatDecision function.
 * - ExplainThreatDecisionOutput - The return type for the explainThreatDecision function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainThreatDecisionInputSchema = z.object({
  frequency: z.number().describe('The frequency of network requests.'),
  payload_size: z.number().describe('The size of the network request payload.'),
  special_chars: z.number().describe('The count of special characters in the request payload.'),
  path_type: z.string().describe('The type of network path (e.g., GET, POST, PUT, DELETE).'),
  predicted_class: z.enum(['Normal', 'Suspicious', 'Attack']).describe('The predicted threat class for the network request.'),
  cluster: z.number().describe('The cluster ID to which the network request belongs.'),
  recommended_action: z.enum(['allow', 'tarpit', 'block']).describe('The adaptive action recommended by the Q-learning agent.'),
});
export type ExplainThreatDecisionInput = z.infer<typeof ExplainThreatDecisionInputSchema>;

const ExplainThreatDecisionOutputSchema = z.object({
  explanation: z.string().describe('A natural language explanation for the threat classification and recommended action.'),
});
export type ExplainThreatDecisionOutput = z.infer<typeof ExplainThreatDecisionOutputSchema>;

export async function explainThreatDecision(input: ExplainThreatDecisionInput): Promise<ExplainThreatDecisionOutput> {
  return explainThreatDecisionFlow(input);
}

const explainThreatDecisionPrompt = ai.definePrompt({
  name: 'explainThreatDecisionPrompt',
  input: { schema: ExplainThreatDecisionInputSchema },
  output: { schema: ExplainThreatDecisionOutputSchema },
  prompt: `You are an expert security analyst providing explainable AI insights.
Given the following network request details, its classification by a machine learning model, and the recommended adaptive action by a Q-learning agent, provide a natural language explanation for these decisions.

Network Request Features:
- Frequency: {{{frequency}}}
- Payload Size: {{{payload_size}}}
- Special Characters Count: {{{special_chars}}}
- Path Type: {{{path_type}}}

ML Model Classification:
- Predicted Threat Class: {{{predicted_class}}}
- Traffic Cluster: {{{cluster}}}

Q-learning Agent Recommendation:
- Recommended Action: {{{recommended_action}}}

Please explain the reasoning for the predicted threat class ({{{predicted_class}}}) based on the network request features and its cluster. Then, explain why the '{{{recommended_action}}}' was chosen as the adaptive action, considering the predicted threat class. Assume the Q-learning agent's goal is to minimize risk while maintaining service availability. Your explanation should be clear, concise, and understandable by a security analyst.`,
});

const explainThreatDecisionFlow = ai.defineFlow(
  {
    name: 'explainThreatDecisionFlow',
    inputSchema: ExplainThreatDecisionInputSchema,
    outputSchema: ExplainThreatDecisionOutputSchema,
  },
  async (input) => {
    const { output } = await explainThreatDecisionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate explanation.');
    }
    return output;
  }
);
