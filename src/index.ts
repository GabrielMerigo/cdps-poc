import express from "express";
import {
  getUserById,
  calculateCDPs,
  CDPS_VALUES,
  getAverageTokensForModel,
  ModelType,
  deductCDPs,
} from "./userService";
import { sendRequestToChatGPT } from "./chatService";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { userId, question } = req.body;

  try {
    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" }) as any;
    }

    const estimatedTokens = getAverageTokensForModel(ModelType.GPT4);
    const estimatedCDPs = calculateCDPs(
      estimatedTokens,
      CDPS_VALUES.CDP_CHAT_4
    );

    if (estimatedCDPs > user.cdpBalance) {
      return res
        .status(404)
        .json({ message: "You don't have sufficient credits" }) as any;
    }

    const { response, tokensUsed } = await sendRequestToChatGPT(
      question,
      "gpt-4"
    );

    const cdpsReallyUsed = calculateCDPs(tokensUsed, CDPS_VALUES.CDP_CHAT_4);

    deductCDPs(user, cdpsReallyUsed);

    return res.json({
      message: "Answer was successfully generated!",
      response,
      tokensUsed,
      cdpBalance: user.cdpBalance,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
