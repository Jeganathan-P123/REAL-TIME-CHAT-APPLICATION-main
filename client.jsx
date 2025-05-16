import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_history');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { text: message, timestamp: new Date().toISOString() };
      socket.emit('send_message', newMessage);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 p-2 rounded shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-white p-2 mb-2 rounded shadow-sm">
            <p>{msg.text}</p>
            <small className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded p-2 mr-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
