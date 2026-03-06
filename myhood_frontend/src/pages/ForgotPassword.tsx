import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    identifier: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier) {
      setErrorMessage('გთხოვთ შეიყვანოთ ელ-ფოსტა ან ნომერი');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/password-reset-request/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: formData.identifier })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setStep(2);
        setSuccessMessage(`თქვენი სატესტო ერთჯერადი კოდი არის: ${data.otp}`);
        
        // Hide the message after 10 seconds
        setTimeout(() => {
          setSuccessMessage('');
          setStatus('idle');
        }, 10000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'მომხმარებელი ვერ მოიძებნა');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('დაფიქსირდა შეცდომა');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
       if (!formData.otp) {
           setStatus('error');
           setErrorMessage('გთხოვთ შეიყვანოთ კოდი');
           return;
       }
       setStep(3);
       setStatus('idle');
       setSuccessMessage('');
       setErrorMessage('');
       return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('პაროლები არ ემთხვევა');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/password-reset-confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier,
          otp: formData.otp,
          new_password: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setSuccessMessage('პაროლი წარმატებით შეიცვალა!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'არასწორი კოდი');
        if (data.error?.includes('Invalid')) {
            setTimeout(() => setStep(2), 1500); // Go back to OTP if invalid
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('დაფიქსირდა შეცდომა');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-8 pb-6 border-b border-slate-50 relative">
            {step > 1 && status !== 'success' && (
              <button 
                onClick={() => setStep(step - 1)}
                className="absolute left-6 top-8 text-slate-400 hover:text-primary transition-colors"
                title="უკან დაბრუნება"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h2 className={`text-2xl font-bold text-slate-900 text-center ${step > 1 ? 'mt-2' : ''}`}>
              პაროლის აღდგენა
            </h2>
            <p className="text-slate-500 text-center text-sm font-medium mt-2">
              {step === 1 && 'შეიყვანეთ თქვენი ელ-ფოსტა ან ნომერი.'}
              {step === 2 && 'შეიყვანეთ 6-ნიშნა კოდი.'}
              {step === 3 && 'შეიყვანეთ ახალი პაროლი.'}
            </p>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {status === 'success' && successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-emerald-50 border border-emerald-100/50 rounded-2xl text-emerald-600 text-sm font-bold text-center flex items-center justify-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  {successMessage}
                </motion.div>
              )}

              {status === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-red-50 border border-red-100/50 rounded-2xl text-red-600 text-sm font-bold text-center"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={step === 1 ? handleRequestOTP : handleConfirmReset} className="space-y-6">
              
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ელ-ფოსტა / ნომერი</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base font-medium text-slate-800" 
                      placeholder="მაგ: 599123456" 
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ერთჯერადი კოდი (OTP)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-center text-xl font-mono tracking-[0.5em] font-bold text-slate-800" 
                      placeholder="000000" 
                      type="text"
                      maxLength={6}
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ახალი პაროლი</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base font-medium text-slate-800" 
                        placeholder="••••••••" 
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">გაიმეორეთ პაროლი</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl focus:bg-white outline-none transition-all text-base font-medium text-slate-800 ${
                          formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                            : 'border-slate-100 focus:border-primary focus:ring-primary/10'
                        }`}
                        placeholder="••••••••" 
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary-600 text-white py-3.5 sm:py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-8 flex justify-center items-center gap-2"
              >
                {status === 'loading' ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {step === 1 ? 'კოდის მიღება' : step === 2 ? 'დადასტურება' : 'შენახვა'}
                    {step < 3 && <ArrowRight size={20} />}
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <Link to="/login" className="text-slate-500 hover:text-primary font-bold text-sm inline-flex items-center gap-2 transition-colors">
              <ArrowLeft size={16} /> უკან ავტორიზაციაზე
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
