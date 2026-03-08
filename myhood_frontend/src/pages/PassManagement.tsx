import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  Wrench,
  DoorOpen,
  Wallet,
  Settings,
  User,
  Bell,
  IdCard,
  Bike,
  Hammer,
  UserCircle,
  Car,
  BellRing,
  Send,
  CheckCircle2,
  Pizza,
  Clock,
  Hash,
  QrCode,
  MoreHorizontal,
  Users,
  Repeat,
  History,
  Search,
  Menu,
  ChevronRight,
  Plus,
  ChevronDown,
  X,
  AlertCircle,
  Phone,
  Trash2,
  RefreshCw,
  Calendar,
  LogOut,
  Vote
} from 'lucide-react';

const Sidebar = ({ userData, activePage }: { userData: any, activePage: string }) => (
  <aside className="hidden lg:flex w-80 flex-col bg-white border-r border-slate-100 h-screen sticky top-0 shrink-0">
    <div className="p-8 flex items-center gap-3 border-b border-slate-50">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
        m
      </div>
      <h2 className="text-slate-900 text-2xl font-bold tracking-tight">myhood</h2>
    </div>
    <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
      <SidebarLink icon={<LayoutDashboard size={22} />} label="მთავარი" to="/dashboard" active={activePage === 'dashboard'} />
      <SidebarLink icon={<Users size={22} />} label="მაცხოვრებლები" to="/residents" active={activePage === 'residents'} />
      <SidebarLink icon={<Wrench size={22} />} label="სერვისები" to="#" active={activePage === 'services'} />
      <SidebarLink icon={<DoorOpen size={22} />} label="ჭიშკრის კონტროლი" to="/passes" active={activePage === 'passes'} />
      <SidebarLink icon={<Wallet size={22} />} label="გადასახადები" to="#" active={activePage === 'billing'} />
      <SidebarLink icon={<Vote size={22} />} label="ხმის მიცემა" to="/votes" active={activePage === 'votes'} />
      <SidebarLink icon={<Settings size={22} />} label="პარამეტრები" to="/profile" active={activePage === 'profile'} />
    </nav>
    <div className="p-6 border-t border-slate-50">
      <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="text-primary" size={20} />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-slate-900 text-sm leading-tight truncate">
            {userData ? `${userData.first_name} ${userData.last_name}` : 'მომხმარებელი'}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {userData?.apartment_number ? `ბინა ${userData.apartment_number}` : 'პროფილი'}
          </p>
        </div>
      </div>
    </div>
  </aside>
);

const SidebarLink = ({ icon, label, active = false, to = "#" }: { icon: React.ReactNode, label: string, active?: boolean, to?: string }) => {
  const navigate = useNavigate();
  return (
    <a
      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-bold text-base cursor-pointer ${active
          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      href={to}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span>{label}</span>
      </div>
      {active && <ChevronRight size={18} />}
    </a>
  );
};

const HeaderMobile = ({ handleLogout }: { handleLogout: () => void }) => (
  <header className="flex lg:hidden items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
    <div className="flex items-center gap-4">
      <button className="p-2 rounded-xl bg-slate-50 text-slate-600">
        <Menu size={24} />
      </button>
      <h2 className="text-slate-900 text-xl font-bold tracking-tight">myhood</h2>
    </div>
    <div className="flex items-center gap-3">
        <button 
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
            <LogOut size={20} />
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
    </div>
  </header>
);

const IssuePassForm = ({ refreshPasses }: { refreshPasses: () => void }) => {
  const [passType, setPassType] = useState('guest');
  const [visitorName, setVisitorName] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [durationDays, setDurationDays] = useState<number | null>(null);
  const [notifyOnArrival, setNotifyOnArrival] = useState(false);

  const [showDaysPopup, setShowDaysPopup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDaysPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!visitorName.trim()) {
      setError('გთხოვთ შეიყვანოთ ვიზიტორის სახელი');
      return;
    }

    if (!durationDays) {
      setError('გთხოვთ აირჩიოთ ხანგრძლივობა');
      return;
    }

    setIsSubmitting(true);

    // Retrieve Auth token
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/passes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pass_type: passType,
          visitor_name: visitorName,
          car_plate: carPlate,
          duration_days: durationDays,
          notify_on_arrival: notifyOnArrival
        })
      });

      if (response.ok) {
        setSuccess('საშვი წარმატებით გაიცა!');
        // Reset form
        setVisitorName('');
        setCarPlate('');
        setDurationDays(null);
        setNotifyOnArrival(false);
        refreshPasses();

        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.detail || 'შეცდომა საშვის გაცემისას');
      }
    } catch (err) {
      setError('სერვერთან დაკავშირება ვერ მოხერხდა');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDurationText = () => {
    if (!durationDays) return 'აირჩიეთ';
    if (durationDays === 7) return '1 კვირა';
    return `${durationDays} დღე`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden sticky top-8"
    >
      <div className="p-8 border-b border-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
            <IdCard size={20} />
          </div>
          საშვის დამზადება
        </h2>
      </div>
      <div className="p-8 space-y-8">

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
              <CheckCircle2 size={20} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">1. აირჩიეთ ტიპი</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <PassTypeOption id="guest" icon={<User size={20} />} label="სტუმარი" checked={passType === 'guest'} onChange={(e: any) => setPassType(e.target.value)} />
            <PassTypeOption id="courier" icon={<Bike size={20} />} label="კურიერი" checked={passType === 'courier'} onChange={(e: any) => setPassType(e.target.value)} />
            <PassTypeOption id="taxi" icon={<Car size={20} />} label="ტაქსი" checked={passType === 'taxi'} onChange={(e: any) => setPassType(e.target.value)} />
            <PassTypeOption id="service" icon={<Hammer size={20} />} label="სერვისი" checked={passType === 'service'} onChange={(e: any) => setPassType(e.target.value)} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">2. დეტალები</label>
          </div>
          <InputField label="ვიზიტორის სახელი" icon={<UserCircle size={20} />} placeholder="მაგ: ნიკა ბერიძე" value={visitorName} onChange={(e: any) => setVisitorName(e.target.value)} />
          <InputField label="ავტომობილის ნომერი" icon={<Car size={20} />} placeholder="AA-000-BB" isMono value={carPlate} onChange={(e: any) => setCarPlate(e.target.value)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">ხანგრძლივობა</label>
              <button
                type="button"
                onClick={() => setShowDaysPopup(!showDaysPopup)}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base font-bold text-slate-800 flex justify-between items-center group"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none mt-3.5">
                  <Calendar size={20} />
                </div>
                <span className="text-primary ml-1">{getDurationText()}</span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${showDaysPopup ? 'rotate-180' : ''}`} />
              </button>

              {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                  {showDaysPopup && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[110] flex justify-center items-center p-4 bg-slate-900/20 backdrop-blur-sm"
                      onClick={() => setShowDaysPopup(false)}
                    >
                      <div 
                        className="relative w-full max-w-sm z-10 lg:absolute lg:right-[calc(50%+350px)] flex justify-center lg:justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <motion.div 
                          initial={{ opacity: 0, x: -50, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -50, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="w-full bg-white/50 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 relative"
                        >
                          <button 
                            type="button" onClick={() => setShowDaysPopup(false)}
                            className="absolute top-6 right-6 h-10 w-10 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm z-10"
                          ><X size={20} /></button>

                          <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-white/60 border border-white/50 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                              <Calendar className="text-primary" size={40} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">ხანგრძლივობა</h3>
                              <p className="text-slate-500 text-sm mt-2">აირჩიეთ საშვის ვადა</p>
                            </div>
                          
                            <div className="grid grid-cols-2 gap-3">
                              {[1, 2, 3, 4, 5, 6].map(day => (
                                <button
                                  key={day} type="button"
                                  onClick={() => { setDurationDays(day); setShowDaysPopup(false); }}
                                  className={`text-center px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                                    durationDays === day 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-y-[1px]' 
                                    : 'bg-white/50 border border-white/50 text-slate-700 hover:bg-white/70 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5'
                                  }`}
                                >
                                  {day} დღე
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => { setDurationDays(7); setShowDaysPopup(false); }}
                                className={`col-span-2 text-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                                  durationDays === 7 
                                  ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-y-[1px]' 
                                  : 'bg-white/50 border border-white/50 text-slate-700 hover:bg-white/70 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5'
                                }`}
                              >
                                1 კვირა
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">შემატყობინე</label>
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <BellRing className="text-slate-400" size={24} />
                <button
                  type="button"
                  onClick={() => setNotifyOnArrival(!notifyOnArrival)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary/20 ${notifyOnArrival ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifyOnArrival ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-600 disabled:opacity-75 disabled:active:scale-100 text-white py-5 px-6 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-3 group"
            type="button"
          >
            {isSubmitting ? 'მუშავდება...' : 'საშვის დამზადება'}
            {!isSubmitting && <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={22} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PassTypeOption = ({ id, icon, label, checked, onChange }: any) => (
  <label className="cursor-pointer group">
    <input checked={checked} onChange={onChange} className="peer sr-only" name="passType" type="radio" value={id} />
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-100 peer-checked:border-primary peer-checked:bg-primary-50/50 transition-all hover:border-slate-200 text-center">
      <div className="text-slate-400 peer-checked:text-primary group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter peer-checked:text-primary group-hover:text-slate-700">{label}</span>
    </div>
  </label>
);

const InputField = ({ label, icon, placeholder, isMono = false, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
        {icon}
      </div>
      <input
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium ${isMono ? 'font-mono uppercase tracking-widest' : ''}`}
        placeholder={placeholder}
        type="text"
      />
    </div>
  </div>
);

const ActivePassesList = ({ passes, fetchPasses, onQrClick }: { passes: any[], fetchPasses: () => void, onQrClick: (pass: any) => void }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDeletePass = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/passes/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchPasses();
        setOpenMenuId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExtendPass = async (pass: any) => {
    try {
      const newDuration = (pass.duration_days || 1) + 1;
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/passes/${pass.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ duration_days: newDuration })
      });
      if (response.ok) {
        fetchPasses();
        setOpenMenuId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="xl:col-span-7 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500" size={24} />
          </div>
          აქტიური საშვები
        </h2>
        <span className="px-5 py-2 rounded-xl text-sm font-bold bg-white border border-slate-100 text-slate-500 shadow-sm">აქტიური: {passes.length}</span>
      </div>

      <div className="space-y-5">
        {passes.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm">
            <div className="inline-flex h-20 w-20 bg-slate-50 rounded-3xl items-center justify-center mb-6">
              <History className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-600">არ არის აქტიური საშვები</h3>
            <p className="text-slate-400 mt-2">ფორმა გამოიყენეთ ახალი საშვის გასაცემად</p>
          </div>
        ) : passes.map((pass: any) => {
          let color = "bg-primary";
          let icon = <User className="text-primary" size={32} />;
          let tagColor = "text-primary bg-primary-50";

          if (pass.pass_type === 'guest') {
            color = "bg-emerald-500";
            icon = <User className="text-emerald-500" size={32} />;
            tagColor = "text-emerald-600 bg-emerald-50";
          } else if (pass.pass_type === 'courier') {
            color = "bg-amber-400";
            icon = <Pizza className="text-amber-500" size={32} />;
            tagColor = "text-amber-600 bg-amber-50";
          } else if (pass.pass_type === 'service') {
            color = "bg-blue-500";
            icon = <Hammer className="text-blue-500" size={32} />;
            tagColor = "text-blue-600 bg-blue-50";
          }

          let timeText = pass.duration_days === null ? 'უვადო' : `${pass.duration_days} დღე`;
          let idShortStr = pass.id.substring(0, 4);

          return (
            <PassCard
              key={pass.id}
              color={color}
              icon={icon}
              title={pass.visitor_name}
              subtitle={pass.car_plate}
              status={pass.status_display}
              time={timeText}
              id={`#${idShortStr}`}
              tagColor={tagColor}
              statusIcon={pass.status === 'entered' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              onQrClick={() => onQrClick(pass)}
              isMenuOpen={openMenuId === pass.id}
              onMenuToggle={(e: any) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === pass.id ? null : pass.id);
              }}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {openMenuId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setOpenMenuId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/50 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative"
            >
              <button onClick={() => setOpenMenuId(null)} className="absolute top-6 right-6 h-10 w-10 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm">
                <X size={20} />
              </button>
              
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-white/60 border border-white/50 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                  <MoreHorizontal className="text-slate-300" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">საშვის მართვა</h3>
                  <p className="text-slate-500 text-sm mt-2">აირჩიეთ მოქმედება საშვისთვის</p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      const p = passes.find((p:any) => p.id === openMenuId);
                      if (p) handleExtendPass(p);
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-base font-bold text-blue-600 bg-white/50 hover:bg-white/70 border border-white/50 transition-colors shadow-sm"
                  >
                    <RefreshCw size={20} />
                    1 დღით გაგრძელება
                  </button>
                  
                  <button 
                    onClick={() => handleDeletePass(openMenuId)}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-base font-bold text-red-600 bg-white/50 hover:bg-white/70 border border-white/50 transition-colors shadow-sm"
                  >
                    <Trash2 size={20} />
                    საშვის წაშლა
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex justify-center"
      >
        <button className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-slate-400 hover:text-primary hover:bg-primary-50 transition-all border border-transparent hover:border-primary/10">
          <History size={20} />
          სრული ისტორია
        </button>
      </motion.div>
    </div>
  );
};

const PassCard = ({ color, icon, title, subtitle, status, time, id, tagColor, statusIcon, onQrClick, isMenuOpen, onMenuToggle }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex items-stretch overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
  >
    <div className={`w-3.5 ${color} self-stretch shrink-0`}></div>
    <div className="flex-1 flex flex-col sm:flex-row items-center py-7 px-8 gap-7">
      <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-2xl font-bold text-slate-900 leading-tight flex flex-wrap items-center justify-center sm:justify-start gap-3">
          {title}
          {id && (
            <span className="text-sm text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl font-bold border border-slate-100/50">
              <Hash size={14} className="inline mr-0.5 -mt-0.5" />
              {id.replace('#', '')}
            </span>
          )}
        </h3>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2.5">
          {subtitle && (
            <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl text-sm font-bold font-mono tracking-wider">
              <Car size={16} /> {subtitle}
            </span>
          )}
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${tagColor}`}>
            {statusIcon} {status}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
        <span className={`text-sm font-bold px-4 py-2 rounded-2xl ${tagColor} shadow-sm`}>{time}</span>
        <div className="flex gap-2 relative">
          <button onClick={onQrClick} className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary-50 transition-all flex items-center justify-center border border-transparent hover:border-primary/10">
            <QrCode size={22} />
          </button>
          
          <div className="relative">
            <button onClick={onMenuToggle} className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center">
              <MoreHorizontal size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function PassManagement() {
  const [activePasses, setActivePasses] = useState([]);
  const [userData, setUserData] = useState<{ first_name?: string, last_name?: string, apartment_number?: string } | null>(null);
  const [showSecurityPopup, setShowSecurityPopup] = useState(false);
  const [qrPopupPass, setQrPopupPass] = useState<any | null>(null);
  const securityPopupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (securityPopupRef.current && !securityPopupRef.current.contains(event.target as Node)) {
        setShowSecurityPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPasses = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/passes/active/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Handle both paginated and unpaginated responses
        setActivePasses(data.results || data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };
  useEffect(() => {
    fetchUserData();
    fetchPasses();
  }, []);

  return (
    <div className="bg-[#fcfdfe] min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-row">
        <Sidebar userData={userData} activePage="passes" />
        <div className="flex h-full grow flex-col w-full max-w-7xl mx-auto">
          <HeaderMobile handleLogout={handleLogout} />
          <main className="flex-1 px-6 lg:px-12 py-10 w-full">
            <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">საშვების მართვა</h1>
                <p className="text-slate-500 text-lg font-medium max-w-2xl">გასცით ახალი საშვები და აკონტროლეთ აქტიური ვიზიტები რეალურ დროში.</p>
              </motion.div>
              <div className="hidden sm:flex items-center gap-4 relative">

                {/* Security Contact Info */}
                <div ref={securityPopupRef} className="relative">
                  <button
                    onClick={() => setShowSecurityPopup(!showSecurityPopup)}
                    className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-slate-800/20 hover:bg-slate-900 transition-all hover:-translate-y-1"
                  >
                    <Phone size={18} />
                    დაცვა
                  </button>
                  {typeof document !== 'undefined' && createPortal(
                    <AnimatePresence>
                      {showSecurityPopup && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowSecurityPopup(false)}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white/50 backdrop-blur-2xl border border-white/50 rounded-[3rem] p-12 max-w-xl w-full shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                          >
                            <button onClick={() => setShowSecurityPopup(false)} className="absolute top-8 right-8 h-12 w-12 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm">
                              <X size={24} />
                            </button>
                            
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/40 cursor-text select-text">
                              <div className="h-24 w-24 rounded-[2rem] bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-800/20">
                                <User size={48} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-3xl">ზურაბ შენგელია</p>
                                <p className="text-xl text-slate-600 font-medium mt-2">ცვლის უფროსი</p>
                              </div>
                            </div>
                            <div className="space-y-6">
                              <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-white/60 text-green-600 flex items-center justify-center shrink-0 border border-white/50 shadow-sm">
                                  <Phone size={36} />
                                </div>
                                <div className="cursor-text select-text">
                                  <p className="font-bold text-slate-800 text-2xl tracking-wide">032 2 123 456</p>
                                  <p className="text-lg text-slate-500 mt-1">საკონტაქტო ნომერი</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-white/60 text-blue-500 flex items-center justify-center shrink-0 border border-white/50 shadow-sm">
                                  <Clock size={36} />
                                </div>
                                <div className="cursor-text select-text">
                                  <p className="font-bold text-slate-800 text-2xl">24 / 7</p>
                                  <p className="text-lg text-slate-500 mt-1">სამუშაო საათები</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )}
                </div>
                <button className="flex items-center justify-center rounded-2xl h-14 w-14 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                  <Search className="group-hover:scale-110 transition-transform" size={24} />
                </button>
                <button className="flex items-center justify-center rounded-2xl h-14 w-14 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-xl hover:shadow-primary/10 transition-all group relative">
                  <Bell className="group-hover:shake transition-transform" size={24} />
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-4 pl-4 ml-2 border-l border-slate-200 cursor-pointer group/profile"
                >
                  <div className="text-right hidden md:block">
                    <p className="font-bold text-slate-900 text-sm leading-tight group-hover/profile:text-primary transition-colors">
                      {userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'მომხმარებელი' : 'იტვირთება...'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium group-hover/profile:text-primary/70 transition-colors">
                      {userData?.apartment_number ? `ბინა ${userData.apartment_number}` : ''}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover/profile:bg-primary/20 transition-colors">
                    <User className="text-primary" size={22} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-5">
                <IssuePassForm refreshPasses={fetchPasses} />
              </div>
              <ActivePassesList passes={activePasses} fetchPasses={fetchPasses} onQrClick={(pass) => setQrPopupPass(pass)} />
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {qrPopupPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setQrPopupPass(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/50 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative"
            >
              <button onClick={() => setQrPopupPass(null)} className="absolute top-6 right-6 h-10 w-10 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm">
                <X size={20} />
              </button>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-white/60 border border-white/50 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                  <QrCode size={40} className="text-slate-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">ჯერ არ ფუნქციონირებს</h3>
                  <p className="text-slate-500 text-sm mt-2">QR კოდით ჭიშკრის გაღების ფუნქცია მზადების პროცესშია.</p>
                </div>

                <div className="bg-white/50 border border-white/50 rounded-2xl p-5 text-left space-y-3 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">მფლობელი</span>
                    <span className="text-sm font-bold text-slate-800">{qrPopupPass.visitor_name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">ნომერი</span>
                    <span className="text-sm font-bold text-slate-800">{qrPopupPass.car_plate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">ვადა</span>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                      {qrPopupPass.duration_days ? `${qrPopupPass.duration_days} დღე` : 'უვადო'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
