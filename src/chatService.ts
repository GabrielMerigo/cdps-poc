import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: "",
});

export async function sendRequestToChatGPT(
  content: string,
  model: string
): Promise<{ response: string; tokensUsed: number }> {
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
  });

  const tokensUsed = completion.usage?.total_tokens || 0;
  const response =
    completion.choices[0].message.content || "Sem resposta gerada.";

  return { response, tokensUsed };
}
