import React, { useState, useEffect } from 'react'
import Header from '../components/Header'

const API_BASE = "/api/v2/user";

function Chats() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/history`, {
          method: "GET",
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "failed to load history");
        }

        setHistory(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='shrink-0'>
        <Header />
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        <h1 className='text-white text-2xl font-bold mb-4 text-center'>Chats</h1>

        {loading && <p className='text-gray-400 text-center'>Loading...</p>}
        {error && <p className='text-red-400 text-center'>{error}</p>}

        {!loading && !error && history.length === 0 && (
          <p className='text-gray-400 text-center'>No chat history yet.</p>
        )}

        <div className='flex flex-col gap-3 max-w-2xl mx-auto'>
          {history.map((item) => (
            <div key={item._id} className='bg-gray-800 p-4 rounded-2xl'>
              <p className='text-blue-400 font-bold mb-1'>{item.subject}</p>
              <p className='text-gray-400 text-sm mb-2'>You asked: {item.prompt}</p>
              <p className='text-white'>{item.response}</p>
              <p className='text-gray-500 text-xs mt-2'>
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Chats