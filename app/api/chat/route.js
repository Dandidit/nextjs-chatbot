const res = await fetch(process.env.OLLAMA_ENDPOINT + "/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      messages: [{ role: "user", content: message }],
    }),
  });