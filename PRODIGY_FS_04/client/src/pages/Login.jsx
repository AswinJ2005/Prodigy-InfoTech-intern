import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Loader2, Sparkles, Lock, User } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('userId', response.data.user.id);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-0 overflow-hidden glass-panel relative z-10 m-4"
      >
        {/* Left Panel - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent-primary/20 transform rotate-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-slate-400">Enter your credentials to access the workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  className="modern-input pl-12"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  className="modern-input pl-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </motion.div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-primary font-semibold hover:text-accent-secondary transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel - Visual */}
        <div className="hidden md:flex bg-dark-lighter/50 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 backdrop-blur-3xl"></div>

          <div className="relative z-10 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-64 h-64 border border-white/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-80 h-80 border border-white/5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
            />

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/30 mb-6">
                <Sparkles className="w-3 h-3 text-accent-secondary" />
                <span className="text-xs font-semibold text-accent-secondary uppercase tracking-widest">Premium Access</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Chat Smart.</h2>
              <p className="text-slate-400 leading-relaxed">
                Experience the future of communication with our new ultra-modern platform.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
