import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, MessageSquare, Hash, User, Clock, Menu, X, Plus, Users, Search, Settings, Smile, Paperclip, MoreVertical } from 'lucide-react';

const socket = io.connect('http://localhost:3001');

function Chat() {
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on('receive_message', receiveMessage);

    return () => {
      socket.off('receive_message', receiveMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const joinRoom = (e) => {
    e.preventDefault();
    if (room !== '') {
      socket.emit('join_room', room);
      setCurrentRoom(room);
      setMessageList([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message !== '' && currentRoom) {
      const messageData = {
        room: currentRoom,
        author: username,
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage('');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Join Room "Modal" / View
  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/10 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg glass-panel overflow-hidden relative z-10 mx-4"
        >
          <div className="bg-gradient-to-r from-accent-primary to-violet-600 p-10 text-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
            />
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Join a Channel</h2>
            <p className="text-indigo-100">Enter a room ID to start chatting</p>
          </div>

          <div className="p-10">
            <form onSubmit={joinRoom} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Room Name</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    className="modern-input pl-12 bg-dark-lighter/50 border-white/5 focus:bg-dark-lighter"
                    placeholder="e.g. general"
                    onChange={(e) => setRoom(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Join Now
              </button>
            </form>

            <button onClick={logout} className="w-full mt-6 text-slate-500 hover:text-white text-sm font-medium transition-colors">
              Sign out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark overflow-hidden font-sans relative">
      {/* Background */}
      <div className="absolute inset-0 bg-dark pointer-events-none"></div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed md:relative z-30 w-80 h-full bg-dark-card/90 backdrop-blur-xl border-r border-white/5 flex flex-col md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-primary/20">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Chat<span className="text-accent-primary">App</span></h1>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-dark-lighter/50 border border-white/5 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50 transition-all placeholder-slate-600"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Active Channel</h3>
              <div className="flex items-center gap-3 px-4 py-3 bg-accent-primary/10 border border-accent-primary/20 rounded-xl text-accent-primary">
                <Hash className="w-5 h-5" />
                <span className="font-semibold">{currentRoom}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Online Users</h3>
              <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-lg transition-all cursor-pointer group">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg">
                    {username[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-dark-card rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{username}</p>
                  <p className="text-xs text-slate-500">You</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 bg-dark-card/50">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setCurrentRoom('')} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-300 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-all">
              <Hash className="w-4 h-4" /> Change
            </button>
            <button onClick={logout} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-dark relative z-0">
        {/* Header */}
        <header className="h-20 bg-dark-card/80 backdrop-blur-md border-b border-white/5 px-6 md:px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-accent-primary" />
                {currentRoom}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 24 members</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="text-emerald-500">Active now</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center justify-center py-10 text-slate-600">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Hash className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-sm">Welcome to the beginning of <span className="font-semibold text-slate-400">#{currentRoom}</span></p>
          </div>

          {messageList.map((msg, i) => {
            const isMyMessage = username === msg.author;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${isMyMessage ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isMyMessage
                    ? 'bg-gradient-to-br from-accent-primary to-violet-600 text-white'
                    : 'bg-dark-lighter border border-white/10 text-slate-300'
                  }`}>
                  <span className="text-sm font-bold">{msg.author[0].toUpperCase()}</span>
                </div>

                <div className={`flex flex-col max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm font-bold ${isMyMessage ? 'text-accent-primary' : 'text-slate-300'}`}>{msg.author}</span>
                    <span className="text-xs text-slate-600">{msg.time}</span>
                  </div>
                  <div className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-md backdrop-blur-sm ${isMyMessage
                      ? 'bg-accent-primary/20 border border-accent-primary/20 text-white rounded-tr-sm'
                      : 'bg-dark-card border border-white/5 text-slate-300 rounded-tl-sm'
                    }`}>
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-dark border-t border-white/5">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={sendMessage} className="relative flex items-end gap-2 bg-dark-card/50 border border-white/10 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-accent-primary/30 focus-within:border-accent-primary/30 transition-all backdrop-blur-sm">
              <button type="button" className="p-3 text-slate-400 hover:text-accent-primary hover:bg-white/5 rounded-xl transition-colors">
                <Plus className="w-6 h-6" />
              </button>

              <div className="flex-1 py-3">
                <input
                  type="text"
                  value={message}
                  placeholder="Type your message..."
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 px-2"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 pr-1 pb-1">
                <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 bg-accent-primary text-white rounded-xl hover:bg-accent-primary/90 disabled:opacity-50 disabled:hover:bg-accent-primary transition-all shadow-lg shadow-accent-primary/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
