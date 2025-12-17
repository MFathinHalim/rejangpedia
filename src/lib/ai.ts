type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chatCompletionsLlamaKolosal(
  msg: string,
  system: string = "",
  response_format: any = undefined,
) {
  if (!process.env.KOLOSAL_AI_TOKEN) {
    throw new Error("Missing KOLOSAL_AI_TOKEN in environment variables");
  }

  const messages: ChatMessage[] = [];

  if (system) {
    messages.push({
      role: "system",
      content: system,
    });
  }

  messages.push({
    role: "user",
    content: msg,
  });

  const body: any = {
    model: "Llama 4 Maverick",
    messages,
  };

  if (response_format) {
    body.response_format = response_format;
  }

  const response = await fetch("https://api.kolosal.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.KOLOSAL_AI_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kolosal AI error ${response.status}: ${text}`);
  }

  const data = await response.json();

  return data?.choices?.[0]?.message?.content || "";
}
