import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Globe, 
  ChevronRight,
  Filter,
  RefreshCw,
  Zap,
  Building2,
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  LogOut,
  User,
  Heart,
  Bookmark,
  ArrowLeft,
  Info,
  Menu,
  X,
  Sparkles,
  Award,
  Lightbulb,
  Newspaper,
  MessageSquare
} from 'lucide-react';
import { Industry, Listing, INDUSTRIES, MOCK_LISTINGS } from './types';
import { cn, formatDate } from './lib/utils';
import { collectListings, getChatResponse, getFeaturedCompanies, CompanyProfile, getResearchData, ResearchData } from './services/geminiService';
import confetti from 'canvas-confetti';

// --- Components ---

const Navbar = ({ 
  isLoggedIn, 
  onLogout, 
  onOpenLogin, 
  onOpenAbout, 
  onOpenHome,
  onOpenSaved,
  onOpenInternships,
  savedCount
}: { 
  isLoggedIn: boolean, 
  onLogout: () => void, 
  onOpenLogin: () => void,
  onOpenAbout: () => void,
  onOpenHome: () => void,
  onOpenSaved: () => void,
  onOpenInternships: () => void,
  savedCount: number
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (callback: () => void) => {
    callback();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => handleNavClick(onOpenHome)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-gold to-green-accent flex items-center justify-center font-bold text-slate-950 relative z-50">
            GT
          </div>
          <span className="text-xl font-display font-bold tracking-tight relative z-50">GT<span className="text-gold">.in</span></span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button onClick={onOpenHome} className="hover:text-gold transition-colors">Home</button>
          <button onClick={onOpenInternships} className="hover:text-gold transition-colors">Internships</button>
          <button onClick={onOpenAbout} className="hover:text-gold transition-colors">About Us</button>
          {isLoggedIn && (
            <button onClick={onOpenSaved} className="hover:text-gold transition-colors flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              Saved ({savedCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">Member Mode</span>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-full border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white relative z-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-950 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              <button 
                onClick={() => handleNavClick(onOpenHome)} 
                className="flex items-center gap-3 text-lg font-medium text-slate-300 hover:text-gold py-2"
              >
                <TrendingUp className="w-5 h-5 text-gold" />
                Home
              </button>
              <button 
                onClick={() => handleNavClick(onOpenInternships)} 
                className="flex items-center gap-3 text-lg font-medium text-slate-300 hover:text-gold py-2"
              >
                <Users className="w-5 h-5 text-gold" />
                Internships
              </button>
              <button 
                onClick={() => handleNavClick(onOpenAbout)} 
                className="flex items-center gap-3 text-lg font-medium text-slate-300 hover:text-gold py-2"
              >
                <Info className="w-5 h-5 text-gold" />
                About Us
              </button>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => handleNavClick(onOpenSaved)} 
                    className="flex items-center gap-3 text-lg font-medium text-slate-300 hover:text-gold py-2"
                  >
                    <Bookmark className="w-5 h-5 text-gold" />
                    Saved Listings ({savedCount})
                  </button>
                  <button 
                    onClick={() => handleNavClick(onLogout)} 
                    className="flex items-center gap-3 text-lg font-medium text-red-400 py-2 mt-4 pt-4 border-t border-white/5"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleNavClick(onOpenLogin)}
                  className="w-full py-4 rounded-xl bg-gold text-slate-950 font-bold text-lg mt-2"
                >
                  Login to Portal
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', parts: [{text: string}]}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    setIsTyping(true);

    const chatHistory = messages.map(m => ({ role: m.role, parts: m.parts }));
    const aiResponse = await getChatResponse(userMsg, chatHistory);
    
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: aiResponse }] }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-linear-to-br from-gold to-green-accent flex items-center justify-center text-slate-950 shadow-2xl relative"
      >
        <Zap className={cn("w-7 h-7", isOpen && "rotate-12")} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gold border-2 border-slate-950"></span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[500px] glass-card rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm leading-tight">Career Scout AI</h4>
                  <p className="text-[10px] text-green-accent font-bold uppercase tracking-wider">Online & Verified</p>
                </div>
              </div>
              <button 
                onClick={() => setMessages([])} 
                className="text-[10px] text-slate-500 hover:text-white uppercase font-black"
              >
                Clear
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 px-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-slate-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Hello! I'm your GT.in career assistant. Ask me about top companies, skills needed, or career advice in India.
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex",
                  m.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-gold text-slate-950 font-medium rounded-tr-none" 
                      : "bg-white/10 text-slate-200 border border-white/10 rounded-tl-none shadow-lg"
                  )}>
                    {m.parts[0].text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-tl-none border border-white/10 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your career question..."
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gold text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5 -rotate-45" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RegisterPage = ({ onRegister, onBackToLogin, onBack }: { onRegister: (userData: any) => void, onBackToLogin: () => void, onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Password validation: exactly 6 digits
    if (!/^\d{6}$/.test(pass)) {
      setError('Password must be exactly 6 numbers');
      return;
    }

    if (pass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      
      onRegister(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative pt-16">
      <div className="absolute inset-0 bg-green-accent/5 blur-[120px] -z-10" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full rounded-3xl p-8 border border-white/10"
      >
        <button onClick={onBack} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-green-accent/10 flex items-center justify-center mx-auto mb-4 border border-green-accent/20">
            <User className="w-8 h-8 text-green-accent" />
          </div>
          <h2 className="text-3xl font-display font-black mb-2">Create Account</h2>
          <p className="text-slate-500">Join GT.in to unlock your career potential.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 focus:border-gold outline-none transition-colors text-slate-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">6-Digit PIN (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                required
                type="password"
                maxLength={6}
                value={pass}
                onChange={e => setPass(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 focus:border-gold outline-none transition-colors text-slate-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Confirm PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                required
                type="password"
                maxLength={6}
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value.replace(/\D/g, ''))}
                placeholder="Confirm 6-digit PIN"
                className={cn(
                  "w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 focus:border-gold outline-none transition-colors text-slate-200",
                  error && "border-red-500/50 focus:border-red-500"
                )}
              />
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 px-1 uppercase tracking-wider">{error}</p>}
          </div>

          <button 
            disabled={isLoading}
            className="w-full h-12 bg-linear-to-r from-gold to-green-accent text-slate-950 font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-gold/10"
          >
            {isLoading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-slate-500">
            Already have an account? <span onClick={onBackToLogin} className="text-gold font-bold hover:underline cursor-pointer">Login here</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const LoginPage = ({ onLogin, onBack, onGoToRegister }: { onLogin: (userData: any) => void, onBack: () => void, onGoToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative pt-16">
      <div className="absolute inset-0 bg-gold/5 blur-[120px] -z-10" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full rounded-3xl p-8 border border-white/10"
      >
        <button onClick={onBack} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 border border-gold/20">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl font-display font-black mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to track your applications and save listings.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 focus:border-gold outline-none transition-colors text-slate-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">6-Digit PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                required
                type="password"
                maxLength={6}
                value={pass}
                onChange={e => setPass(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 focus:border-gold outline-none transition-colors text-slate-200"
              />
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 px-1 uppercase tracking-wider">{error}</p>}
          </div>

          <button 
            disabled={isLoading}
            className="w-full h-12 bg-gold text-slate-950 font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <span onClick={onGoToRegister} className="text-gold font-bold hover:underline cursor-pointer">Register Free</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Hero = ({ stats }: { stats: { companies: number, industries: number, listings: number } }) => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Background Accents */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gold/10 blur-[120px] -z-10 rounded-full" />
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-accent/10 blur-[100px] -z-10 rounded-full" />

    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gold text-xs font-bold uppercase tracking-widest mb-6"
        >
          Future-Proof Your Career
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight"
        >
          Find Your Next <span className="gradient-text">Great Leap</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The premier portal connecting ambitious talent with top-tier training programmes and high-growth job opportunities across India's core sectors.
        </motion.p>
 
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-bold text-white">{stats.companies}+</span>
            <span className="text-slate-500 text-sm uppercase tracking-wide">Top Companies</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-bold text-gold">{stats.industries}</span>
            <span className="text-slate-500 text-sm uppercase tracking-wide">Industries</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-bold text-green-accent">{stats.listings}+</span>
            <span className="text-slate-500 text-sm uppercase tracking-wide">Live Vacancies</span>
          </div>
        </motion.div>
 
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex items-center justify-center gap-2 text-xs font-bold text-blue-accent/60 uppercase tracking-[0.2em] animate-pulse"
        >
          <Zap className="w-3 h-3" />
          <span>AI Engine Scouting live careers pages...</span>
        </motion.div>
      </div>
    </div>
  </section>
);

const AboutPage = () => {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedCompanies().then(data => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative max-w-7xl mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-accent/5 blur-[120px] -z-10 rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full rounded-3xl p-12 text-center mb-16"
      >
        <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-gold to-green-accent flex items-center justify-center mx-auto mb-8 shadow-lg shadow-gold/20">
          <Info className="w-10 h-10 text-slate-950" />
        </div>
        <h2 className="text-4xl font-display font-black mb-6">About GT.in</h2>
        <div className="space-y-6 text-xl text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
          <p>
            This site helps you to find the Company training related data and displays it to students or people who want it.
          </p>
          <p>
            Our mission is to bridge the gap between India's top talent and the best opportunities in technology, healthcare, and beyond.
          </p>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-center gap-16">
          <div>
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Verified</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gold mb-1">Live</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Updates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-accent mb-1">Free</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Access</div>
          </div>
        </div>
      </motion.div>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-6 h-6 text-gold" />
          <h3 className="text-2xl font-display font-bold">Featured Partners</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 h-64 animate-pulse">
                <div className="w-1/2 h-6 bg-white/10 rounded mb-4" />
                <div className="w-full h-4 bg-white/5 rounded mb-2" />
                <div className="w-full h-4 bg-white/5 rounded mb-2" />
                <div className="w-3/4 h-4 bg-white/5 rounded mb-6" />
                <div className="w-1/3 h-4 bg-gold/10 rounded" />
              </div>
            ))
          ) : (
            profiles.map((profile, index) => (
              <motion.div
                key={profile.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 border border-white/10 hover:border-gold/30 transition-all group"
              >
                <h4 className="text-xl font-display font-bold mb-4 group-hover:text-gold transition-colors">{profile.name}</h4>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed italic border-l-2 border-gold/50 pl-4">
                  "{profile.mission}"
                </p>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Background</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{profile.history}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Core Focus</h5>
                    <p className="text-xs font-bold text-gold">{profile.focus}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ListingCard = ({ 
  listing, 
  isLoggedIn, 
  isSaved, 
  onToggleSave,
  onResearch
}: { 
  listing: Listing, 
  isLoggedIn: boolean, 
  isSaved: boolean, 
  onToggleSave: (id: string) => void,
  onResearch: (listing: Listing) => void
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Job': return 'text-blue-accent bg-blue-accent/10 border-blue-accent/20';
      case 'Training': return 'text-green-accent bg-green-accent/10 border-green-accent/20';
      case 'Internship': return 'text-gold bg-gold/10 border-gold/20';
      case 'Both': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  const getIcon = () => {
    if (listing.type === 'Training') return <GraduationCap className="w-4 h-4" />;
    if (listing.type === 'Internship') return <Users className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card rounded-2xl p-6 flex flex-col h-full group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xl group-hover:bg-gold group-hover:text-slate-950 transition-colors">
            {listing.companyName[0]}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg leading-tight group-hover:text-gold transition-colors">
              {listing.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium">{listing.companyName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onResearch(listing)}
            className="p-2.5 rounded-lg border bg-white/5 border-white/10 text-blue-accent hover:border-blue-accent/50 hover:bg-blue-accent/10 transition-all group/ai"
            title="AI In-depth Research"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          {isLoggedIn && (
            <button 
              onClick={() => onToggleSave(listing.id)}
              className={cn(
                "p-2.5 rounded-lg border transition-all",
                isSaved 
                  ? "bg-gold/10 border-gold/50 text-gold shadow-[0_0_15px_-3px_rgba(251,191,36,0.3)]" 
                  : "bg-white/5 border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-400"
              )}
            >
              <Heart className={cn("w-4 h-4", isSaved && "fill-gold")} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {listing.priority && listing.priority > 0 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold/20 border border-gold/40 text-gold flex items-center gap-1.5 animate-pulse">
            <Zap className="w-3 h-3 fill-gold" />
            High Growth
          </span>
        )}
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
          getTypeColor(listing.type)
        )}>
          {getIcon()}
          {listing.type}
        </span>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400">
          {listing.industry}
        </span>
      </div>

      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {listing.description}
      </p>

      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">About {listing.companyName}</p>
        <p className="text-[11px] text-slate-500 leading-relaxed italic border-l border-white/10 pl-3">
          {listing.companyDescription}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Key Benefits</p>
        <div className="flex flex-wrap gap-2">
          {listing.benefits.map(benefit => (
            <div key={benefit} className="flex items-center gap-1 text-[10px] text-green-accent font-medium">
              <span className="w-1 h-1 rounded-full bg-green-accent" />
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex-grow">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Required Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {listing.skills.slice(0, 3).map(skill => (
            <span key={skill} className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
              {skill}
            </span>
          ))}
          {listing.skills.length > 3 && (
            <span className="text-xs text-slate-500">+{listing.skills.length - 3}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-600 font-medium">Posted {formatDate(listing.postedAt)}</span>
          <span className="text-[10px] text-gold/60 font-bold uppercase tracking-tight">Deadline: {formatDate(listing.applicationDeadline)}</span>
        </div>
        <motion.a 
          href={listing.applyUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center gap-1 text-sm font-bold text-gold hover:text-white transition-colors no-underline"
        >
          Apply Now <ChevronRight className="w-4 h-4 translate-y-[1px]" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'login' | 'about' | 'register' | 'internships'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState<Industry | 'All'>('All');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [researchData, setResearchData] = useState<{ listing: Listing, data: ResearchData } | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#fbbf24']
        });
      }
      return next;
    });
  };

  const handleResearch = async (listing: Listing) => {
    setIsResearching(true);
    const data = await getResearchData(listing.companyName, listing.title);
    if (data) {
      setResearchData({ listing, data });
    }
    setIsResearching(false);
  };

  const ResearchModal = () => {
    if (!researchData) return null;
    const { listing, data } = researchData;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setResearchData(null)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">AI In-depth Research</h2>
                <p className="text-xs text-slate-500">{listing.title} @ {listing.companyName}</p>
              </div>
            </div>
            <button 
              onClick={() => setResearchData(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-accent font-bold text-xs uppercase tracking-widest">
                <Newspaper className="w-4 h-4" />
                Latest Company News
              </div>
              <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {data.news}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-accent font-bold text-xs uppercase tracking-widest">
                <MessageSquare className="w-4 h-4" />
                Interview Process & Common Questions
              </div>
              <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {data.interview}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest">
                <Award className="w-4 h-4" />
                Employee Sentiment & Culture
              </div>
              <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {data.sentiment}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                <Lightbulb className="w-4 h-4" />
                GT.in Prep Recommendations
              </div>
              <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                {data.prep}
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-white/5 flex gap-4">
            <a 
              href={listing.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-grow py-3 rounded-xl bg-gold text-slate-950 font-bold text-center hover:scale-[1.02] transition-transform shadow-lg shadow-gold/20"
            >
              Continue to Application
            </a>
            <button 
              onClick={() => setResearchData(null)}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const currentListings = showSavedOnly 
    ? listings.filter(l => savedIds.has(l.id))
    : listings;

  const filteredListings = (activeIndustry === 'All' 
    ? currentListings 
    : currentListings.filter(l => l.industry === activeIndustry))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const stats = {
    companies: [...new Set(listings.map(l => l.companyName))].length,
    industries: [...new Set(listings.map(l => l.industry))].length,
    listings: listings.length
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const newItems = await collectListings(activeIndustry === 'All' ? undefined : activeIndustry);
    if (newItems.length > 0) {
      setListings(prev => [...newItems, ...prev].slice(0, 80));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#10b981', '#3b82f6']
      });
    }
    setIsRefreshing(false);
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={() => setIsLoggedIn(false)} 
          onOpenLogin={() => setView('login')}
          onOpenAbout={() => setView('about')}
          onOpenInternships={() => setView('internships')}
          onOpenHome={() => { setView('home'); setShowSavedOnly(false); }}
          onOpenSaved={() => { setView('home'); setShowSavedOnly(true); }}
          savedCount={savedIds.size}
        />
        <LoginPage 
          onLogin={(u) => { setIsLoggedIn(true); setView('home'); }} 
          onBack={() => setView('home')} 
          onGoToRegister={() => setView('register')}
        />
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={() => setIsLoggedIn(false)} 
          onOpenLogin={() => setView('login')}
          onOpenAbout={() => setView('about')}
          onOpenInternships={() => setView('internships')}
          onOpenHome={() => { setView('home'); setShowSavedOnly(false); }}
          onOpenSaved={() => { setView('home'); setShowSavedOnly(true); }}
          savedCount={savedIds.size}
        />
        <RegisterPage 
          onRegister={(u) => { setIsLoggedIn(true); setView('home'); }} 
          onBackToLogin={() => setView('login')}
          onBack={() => setView('home')} 
        />
      </div>
    );
  }

  const InternshipPageContent = () => (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <div className="mb-12">
        <h2 className="text-4xl font-display font-black mb-4">Student <span className="text-gold">Internships</span></h2>
        <p className="text-slate-400 max-w-2xl">Discover exclusive internship opportunities from India's top companies. Gain hands-on experience and kickstart your career.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings
          .filter(l => l.type === 'Internship')
          .sort((a, b) => (b.priority || 0) - (a.priority || 0))
          .map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ListingCard 
              listing={listing} 
              isLoggedIn={isLoggedIn}
              isSaved={savedIds.has(listing.id)}
              onToggleSave={toggleSave}
              onResearch={handleResearch}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div id="app-root" className="min-h-screen">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={() => { setIsLoggedIn(false); setSavedIds(new Set()); setShowSavedOnly(false); }} 
        onOpenLogin={() => setView('login')} 
        onOpenAbout={() => setView('about')}
        onOpenInternships={() => setView('internships')}
        onOpenHome={() => { setView('home'); setShowSavedOnly(false); }}
        onOpenSaved={() => { setView('home'); setShowSavedOnly(true); }}
        savedCount={savedIds.size}
      />
      
      <main id="main-content">
        <AnimatePresence mode="wait">
          {view === 'about' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AboutPage />
            </motion.div>
          ) : view === 'internships' ? (
            <motion.div
              key="internships"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <InternshipPageContent />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero stats={stats} />

              {/* Filter & Listing Section */}
              <section id="listings-section" className="max-w-7xl mx-auto px-4 pb-24">
                <div id="filter-bar" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-2 pb-2 overflow-x-auto scrollbar-hide no-scrollbar">
                    <button
                      onClick={() => { setActiveIndustry('All'); setShowSavedOnly(false); }}
                      className={cn(
                        "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                        activeIndustry === 'All' && !showSavedOnly
                          ? "bg-gold text-slate-950" 
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      All Industries
                    </button>
                    {INDUSTRIES.map(industry => (
                      <motion.button
                        key={industry}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setActiveIndustry(industry); setShowSavedOnly(false); }}
                        className={cn(
                          "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                          activeIndustry === industry && !showSavedOnly
                            ? "bg-gold text-slate-950" 
                            : "bg-white/5 text-slate-400 hover:bg-white/10"
                        )}
                      >
                        {industry}
                      </motion.button>
                    ))}
                    {isLoggedIn && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSavedOnly(!showSavedOnly)}
                        className={cn(
                          "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2",
                          showSavedOnly
                            ? "bg-gold text-slate-950" 
                            : "bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", showSavedOnly && "fill-slate-950")} />
                        My Saves
                      </motion.button>
                    )}
                  </div>

                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 disabled:opacity-50 transition-all shrink-0"
                  >
                    <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                    {isRefreshing ? "Auto-collecting..." : "Refresh Data"}
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredListings.map((listing, index) => (
                      <motion.div 
                        key={listing.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.02
                        }}
                      >
                        <ListingCard 
                          listing={listing} 
                          isLoggedIn={isLoggedIn}
                          isSaved={savedIds.has(listing.id)}
                          onToggleSave={toggleSave}
                          onResearch={handleResearch}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>


              {filteredListings.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500 mb-4">
                    {showSavedOnly ? "You haven't saved any listings yet." : "No listings found for this industry."}
                  </p>
                  {!showSavedOnly && (
                    <button 
                      onClick={handleRefresh}
                      className="text-gold font-bold underline"
                    >
                      Try auto-collecting now
                    </button>
                  )}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>

      <AnimatePresence>
        {isResearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="relative">
              <RefreshCw className="w-16 h-16 text-gold animate-spin" />
              <Sparkles className="w-8 h-8 text-blue-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="mt-8 text-2xl font-display font-black text-white tracking-tight">AI Agent Scouting Details...</h2>
            <p className="mt-2 text-slate-400 max-w-sm">Gathering real-time news, interview insights, and culture data from live web sources.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {researchData && <ResearchModal />}
      </AnimatePresence>

      <ChatAssistant />

      <footer className="border-t border-white/10 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded bg-slate-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              GT
            </div>
            <span className="text-sm font-display font-medium tracking-tight">GT.in &copy; 2024</span>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
