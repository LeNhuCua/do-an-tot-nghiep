import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../../API';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách tin nhắn từ Laravel backend
    axios.get(`${API}/messages`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Message List</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            <strong>Sender:</strong> {message.sender_id}, <strong>Receiver:</strong> {message.receiver_id}, <strong>Content:</strong> {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
