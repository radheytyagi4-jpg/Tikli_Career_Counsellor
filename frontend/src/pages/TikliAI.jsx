import React, { useState } from 'react'
import Header from '../components/Header'

const API_BASE = "/api/v2/user"
function TikliAI() {
  const [messages, setMessages] = useState([
    { text: "", sender: "user" },
    { text: "", sender: "ai" }
  ]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setMessages((prev) => [...prev, { text: currentPrompt, sender: "user" }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/responseGenerater`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "something went wrong");
      }

      setMessages((prev) => [...prev, { text: data.data.response, sender: "ai" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: `Error: ${err.message}`, sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      {/* Header — fixed height, never scrolls */}
      <div className='shrink-0'>
        <Header />
      </div>

      {/* Messages — the ONLY scrollable part */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <p className="text-white bg-gray-700 w-fit px-4 py-2 rounded-2xl">
              {message.text}
            </p>
          </div>
        ))}
        {loading && (
          <div className='flex justify-start'>
            <p className="text-white bg-gray-700 w-fit px-4 py-2 rounded-2xl italic">
              typing...
            </p>
          </div>
        )}
      </div>

      {/* Input — fixed height, never scrolls */}
      <div className='shrink-0 flex justify-center items-end gap-2 pb-6 px-4 pt-2'>
        <input
          type="text"
          placeholder="Type here..."
          className='bg-white min-w-100 text-black font-bold h-10 p-4 rounded-3xl md:min-w-2xl md:p-6 md:text-2xl'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className='bg-gray-500 w-10 h-10 rounded-sm font-bold text-3xl md:w-12 md:h-12 disabled:opacity-50'
        >
          ↑
        </button>
      </div>
    </div>
  )
}

export default TikliAI