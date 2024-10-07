interface User {
  id: string;
  cdpBalance: number;
}

let users: User[] = [{ id: "user1", cdpBalance: 1000 }];

export enum CDPS_VALUES {
  CDP_CHAT_4O_MINI = 6,
  CDP_CHAT_4_TURBO = 3,
  CDP_CHAT_4 = 2,
}

export enum ModelType {
  GPT4 = "gpt-4",
  GPT4Turbo = "gpt-4-turbo",
  GPT4Mini = "gpt-4-mini",
}

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

export function deductCDPs(user: User, cdps: number): void {
  if (user.cdpBalance < cdps) {
    throw new Error("Saldo insuficiente de CDPs.");
  }
  user.cdpBalance -= cdps;
}

export function getAverageTokensForModel(model: ModelType): number {
  switch (model) {
    case ModelType.GPT4:
      return 200;
    case ModelType.GPT4Turbo:
      return 150;
    case ModelType.GPT4Mini:
      return 100;
    default:
      throw new Error("Modelo não suportado.");
  }
}

export function calculateCDPs(tokens: number, cdpValue: CDPS_VALUES): number {
  return Math.ceil(tokens / cdpValue);
}
