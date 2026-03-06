import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Menu, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           email: identifier, // My backend treats 'email' field in JSON as the identifier (can be email or phone)
           password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // Successful login, could redirect to dashboard
        setTimeout(() => {
            navigate('/profile'); // Redirects to the new profile page
        }, 1000);
      } else {
         setStatus('error');
         setErrorMessage(data.detail || 'ავტორიზაცია ვერ მოხერხდა');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('სერვერთან კავშირი ვერ მოხერხდა');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            m
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">myhood</h1>
        </div>
        <button className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
          <Menu size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 p-8 md:p-12"
        >
          {/* Icon & Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-primary mb-6">
              <LogIn size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">ავტორიზაცია</h2>
            <p className="text-slate-500 font-medium">კეთილი იყოს თქვენი მობრძანება</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {status === 'success' && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-semibold text-center">
                ავტორიზაცია წარმატებით გაიარეთ!
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold text-center">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                ელ-ფოსტა ან ტელეფონი
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="შეიყვანეთ მონაცემები"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                პაროლი
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">დამიმახსოვრე</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline underline-offset-4">
                დაგავიწყდათ პაროლი?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'loading' ? 'მიმდინარეობს...' : 'შესვლა'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              არ გაქვთ ანგარიში? 
              <Link to="/register" className="ml-2 text-primary font-bold hover:underline">რეგისტრაცია</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
