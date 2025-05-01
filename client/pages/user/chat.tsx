import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import Layout from '../../components/Layout';
import { Router, useRouter } from 'next/router';

const socket = io('http://localhost:5000');

type ChatMessage = {
  sender: string;
  message: string;
  type?: 'system'; // Optional: only used for system messages
};

export default function Home() {
    const router = useRouter();
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setTempName(user?.name)
  }, []);

  useEffect(() => {
    joinChat()
  }, [tempName])


  const joinChat = () => {
    if (tempName.trim()) {
      setUsername(tempName);
      socket.emit('join', tempName);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chat]);

  const leaveChat = useCallback(() => {
    socket.emit('leave', username);
    router.push('/admin-dashboard')
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { message, sender: username });
      setMessage('');
      socket.emit('stop_typing');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on('user_list', (activeUsers) => {
      setUsers(activeUsers);
    });

    socket.on('user_typing', (user) => {
      setTypingUser(user);
    });

    socket.on('status_update', ({ user, status }) => {
      setOnlineStatus((prev) => ({
        ...prev,
        [user]: status === 'online',
      }));
    });

    return () => {
      socket.off('leave');
      socket.off('receive_message');
      socket.off('user_list');
      socket.off('user_typing');
      socket.off('status_update');
    };
  }, []);


  return (
    <Layout showSidebar={true}>
      <div className="flex h-auto min-h-150">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 border-r p-4">
          <h2 className="font-bold text-lg mb-4">Online Users</h2>
          {users.map((user, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className={`h-3 w-3 rounded-full ${onlineStatus[user] ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>{user}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 h-200 flex flex-col p-6" >
          <div className="border-2 bg-red-600 mb-5 border-red-600 rounded-2xl items-center w-22 p-1 ml-auto flex" onClick={leaveChat}>
            <div className="text-white">leave chat</div>
          </div>

          <div className="flex-1 overflow-y-auto border rounded p-4 mb-2 space-y-2" ref={messagesEndRef}>
            {chat.map((c, i) => {
              if (c.type === 'system') {
                return (
                  <div key={i} className="text-center text-gray-500 italic text-sm">
                    {c.message}
                  </div>
                );
              }

              const isCurrentUser = c.sender === username;
              const showAvatar = chat[i - 1]?.sender !== c.sender;

              return (
                <div key={i} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-xs w-fit">
                    {showAvatar && (
                      <div className={`mb-1 flex items-center gap-2 ${isCurrentUser ? 'justify-end flex-row-reverse' : ''}`}>
                        <div className="border rounded-full bg-gray-200 h-10 w-10 flex items-center justify-center text-lg font-bold">
                          {c.sender?.charAt(0).toUpperCase()}
                        </div>
                        <strong className="text-sm">{c.sender}</strong>
                      </div>
                    )}
                    <div
                      className={`p-2 rounded-lg ${isCurrentUser ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black'
                        }`}
                    >
                      {c.message}
                    </div>
                  </div>
                </div>
              );
            })}
            {typingUser && (
              <div className="italic text-gray-500">{typingUser} is typing...</div>
            )}
          </div>


          <div className="flex gap-2">
            <input
              className="flex-grow border p-2 rounded"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit('typing', username);
                if (!e.target.value) socket.emit('stop_typing');
              }}
              onBlur={() => socket.emit('stop_typing')}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
