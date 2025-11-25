"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
  
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
  
    if (!res.ok) {
      // handle API errors gracefully
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      setMessages(prev => [...prev, { role: "user", content: input }, { role: "assistant", content: err.error ?? "Error from API" }]);
      setInput("");
      return;
    }
  
    const data = await res.json();
  
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      data,
    ]);
  
    setInput("");
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>My Vercel Chatbot</h1>

      <div style={{
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        minHeight: 300
      }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role}: </strong>{msg.content}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <input
          style={{ flex: 1, padding: 10 }}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </main>
  );
}
