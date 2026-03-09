import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Vote, 
  BadgeIcon as IdCard, 
  Wrench, 
  FileText, 
  Settings, 
  Menu, 
  Bell, 
  HeartHandshake,
  Plus, 
  ThumbsUp, 
  ThumbsDown,
  Hammer,
  Armchair,
  TreePine,
  CircleParking,
  LogOut,
  X,
  Clock,
  CheckCircle2
} from 'lucide-react';

const Sidebar = ({ userData, activePage }: { userData: any, activePage: string }) => (
  <aside className="hidden lg:flex w-80 flex-col bg-white border-r border-slate-100 h-screen sticky top-0 shrink-0">
    <div className="p-8 flex items-center gap-3 border-b border-slate-50">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
        m
      </div>
      <h2 className="text-slate-900 text-2xl font-black tracking-tight">myhood</h2>
    </div>

    <nav className="flex flex-col gap-2 p-6 overflow-y-auto grow">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">მენიუ</span>
      <SidebarLink icon={<LayoutDashboard size={20} />} label="მთავარი" to="/dashboard" active={activePage === 'dashboard'} />
      <SidebarLink icon={<Users size={20} />} label="მაცხოვრებლები" to="/residents" active={activePage === 'residents'} />
      <SidebarLink icon={<Wrench size={20} />} label="სერვისები" to="/services" active={activePage === 'services'} />
      <SidebarLink icon={<IdCard size={20} />} label="ჭიშკრის კონტროლი" to="/passes" active={activePage === 'passes'} />
      <SidebarLink icon={<Wallet size={20} />} label="გადასახადები" to="/billing" active={activePage === 'billing'} />
      <SidebarLink icon={<Vote size={20} />} label="ხმის მიცემა" to="/votes" active={activePage === 'votes'} />
      <SidebarLink icon={<FileText size={20} />} label="დოკუმენტები" to="/documents" active={activePage === 'documents'} />
      <SidebarLink icon={<HeartHandshake size={20} />} label="სამეზობლო" to="/neighborhood" active={activePage === 'neighborhood'} />
      <SidebarLink icon={<Settings size={20} />} label="პარამეტრები" to="/settings" active={activePage === 'settings'} />
    </nav>
    
    <div className="p-6 border-t border-slate-50 mt-auto bg-slate-50/50">
      <Link to="/profile" className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
          {userData?.first_name ? userData.first_name[0] : <Users size={20} />}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
            {userData?.first_name} {userData?.last_name}
          </span>
          <span className="text-xs font-bold text-slate-500">ბინა {userData?.apartment_number}</span>
        </div>
      </Link>
    </div>
  </aside>
);

const SidebarLink = ({ icon, label, active = false, to = "#" }: { icon: React.ReactNode, label: string, active?: boolean, to?: string }) => {
  if (active) {
    return (
      <Link to={to} className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-bold shadow-md shadow-primary/20 transition-all">
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all">
      {icon}
      {label}
    </Link>
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

export default function Votes() {
  const [userData, setUserData] = useState<{ id?: number, first_name?: string, last_name?: string, apartment_number?: string } | null>(null);
  const [polls, setPolls] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    duration: 7,
    passing_percentage: 50,
    owners_only: false,
    budget: 0,
  });
  const [userStats, setUserStats] = useState({ total_residents: 1, total_owners: 1 });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selectedPoll, setSelectedPoll] = useState<any | null>(null);
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const fetchPolls = async (token: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/votes/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setPolls(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    const fetchUserStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/stats/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserStats({ 
            total_residents: data.total_residents || 1, 
            total_owners: data.total_owners || 1 
          });
        }
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      }
    };

    fetchUserData();
    fetchUserStats();
    fetchPolls(token);
  }, [navigate]);

  const handleVote = async (pollId: string, choice: string) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/votes/${pollId}/vote/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ choice })
      });
      if (response.ok) {
        fetchPolls(token);
      } else {
        const err = await response.json();
        alert(err.detail || 'შეცდომა ხმის მიცემისას');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePoll = (pollId: string) => {
    setDeletingPollId(pollId);
  };

  const confirmDeletePoll = async () => {
    if (!deletingPollId) return;
    
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/votes/${deletingPollId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDeletingPollId(null);
        if (selectedPoll?.id === deletingPollId) {
          setSelectedPoll(null);
        }
        fetchPolls(token);
      } else {
        const err = await response.json();
        alert(err.detail || 'შეცდომა წაშლისას');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('title', newPoll.title);
    formData.append('description', newPoll.description);
    formData.append('duration', newPoll.duration.toString());
    formData.append('passing_percentage', newPoll.passing_percentage.toString());
    formData.append('owners_only', newPoll.owners_only ? 'true' : 'false');
    formData.append('budget', newPoll.budget.toString());
    if (documentFile) formData.append('document', documentFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/votes/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewPoll({ title: '', description: '', duration: 7, passing_percentage: 50, owners_only: false, budget: 0 });
        setDocumentFile(null);
        fetchPolls(token);
      } else {
        const err = await response.json();
        alert('შეცდომა რეზოლუციის დამატებისას: ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error("Failed to add initiative:", error);
    }
  };

  const activePolls = polls.filter(p => p.is_active);
  const completedPolls = polls.filter(p => !p.is_active);

  const calculateCostPerResident = () => {
    if (!newPoll.budget || newPoll.budget <= 0) return 0;
    const divisor = newPoll.owners_only ? userStats.total_owners : userStats.total_residents;
    return Math.ceil(newPoll.budget / Math.max(1, divisor));
  };
  const costPerResident = calculateCostPerResident();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-display relative selection:bg-primary/20 selection:text-primary">
      <Sidebar userData={userData} activePage="votes" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderMobile handleLogout={handleLogout} />

        {/* Top Header for Desktop */}
         <header className="hidden lg:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-5 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">ხმის მიცემა</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:text-primary hover:bg-blue-50 transition-all relative">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">
                    {userData?.first_name} {userData?.last_name}
                  </p>
                  <p className="text-slate-500 text-xs font-bold mt-0.5">ბინა {userData?.apartment_number}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title="გასვლა"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>

        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-slate-900 text-3xl font-black tracking-tight mb-2">ხმის მიცემა და ინიციატივები</h1>
                <p className="text-slate-500 font-bold text-sm md:text-base">მიიღეთ მონაწილეობა საზოგადოების გადაწყვეტილებებში, თვალი ადევნეთ აქტიურ გამოკითხვებს და გადახედეთ წარსულ რეზოლუციებს.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-blue-600 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] shrink-0 w-full md:w-auto"
              >
                <Plus size={20} />
                ინიციატივის დამატება
              </button>
            </div>

            <div className="space-y-6">
              <h2 className="text-slate-900 text-xl font-black tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Vote size={18} />
                </div>
                აქტიური გამოკითხვები
              </h2>
              
              {activePolls.length === 0 ? (
                <div className="p-8 text-center text-slate-500">მიმდინარე გამოკითხვები არ არის.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activePolls.map(poll => {
                    const daysRemaining = Math.max(0, Math.ceil((new Date(poll.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
                    const yesPercent = poll.total_votes > 0 ? (poll.yes_votes / poll.total_votes) * 100 : 0;
                    const noPercent = poll.total_votes > 0 ? (poll.no_votes / poll.total_votes) * 100 : 0;
                    const imageUrl = poll.image || "https://images.unsplash.com/photo-1557597774-9d273e3871ee?q=80&w=1000&auto=format&fit=crop";
                    const costPerResident = poll.budget > 0 ? 
                      Math.round(poll.budget / (poll.owners_only ? userStats.total_owners : userStats.total_residents)) : 0;

                    return (
                      <div 
                        key={poll.id} 
                        onClick={() => setSelectedPoll(poll)}
                        className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden flex flex-col cursor-pointer group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all h-full"
                      >
                        <div className="w-full h-48 bg-cover bg-center shrink-0" style={{backgroundImage: `url("${imageUrl}")`}} />
                        
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-3 gap-2">
                            <h3 className="text-slate-900 text-xl font-black leading-tight line-clamp-2">{poll.title}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                                {String(userData?.id) === String(poll.created_by) && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeletePoll(poll.id); }}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="წაშლა"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                                <span className="bg-blue-50 text-primary border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-xl">
                                  სრულდება {daysRemaining} დღეში
                                </span>
                            </div>
                          </div>
                          
                          {poll.document && (
                            <a 
                              href={poll.document}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100 w-fit px-3 py-1.5 rounded-lg mb-4 cursor-pointer transition-colors"
                            >
                              <FileText size={14} /> დოკუმენტის ნახვა
                            </a>
                          )}

                          <div className="space-y-3 mt-auto mb-6">
                            {poll.budget > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-500">ბიუჯეტი 1 მოსახლეზე</span>
                                <span className="font-black text-slate-800">{costPerResident} ₾</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-slate-500">საჭიროა</span>
                              <span className="font-black text-slate-800">{poll.passing_percentage}% მომხრე</span>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-400">მონაწილეობა ({poll.total_votes} ხმა)</span>
                                <div className="flex gap-2">
                                  <span className="text-emerald-500">{Math.round(yesPercent)}% კი</span>
                                  <span className="text-red-500">{Math.round(noPercent)}% არა</span>
                                </div>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${yesPercent}%` }} transition={{ duration: 1, delay: 0.2 }} className="bg-emerald-500 h-full" />
                                <motion.div initial={{ width: 0 }} animate={{ width: `${noPercent}%` }} transition={{ duration: 1, delay: 0.2 }} className="bg-red-500 h-full" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 shrink-0 mt-auto pt-4 border-t border-slate-50">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleVote(poll.id, 'yes'); }}
                              className={`flex-1 flex items-center justify-center gap-2 rounded-xl h-12 font-bold transition-all active:scale-[0.98] ${
                                poll.user_vote === 'yes' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                              }`}
                            >
                              <ThumbsUp size={18} />
                              კი
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleVote(poll.id, 'no'); }}
                              className={`flex-1 flex items-center justify-center gap-2 rounded-xl h-12 font-bold transition-all active:scale-[0.98] ${
                                poll.user_vote === 'no' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                              }`}
                            >
                              <ThumbsDown size={18} />
                              არა
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-6 pt-4">
              <h2 className="text-slate-900 text-xl font-black tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                დასრულებული
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {completedPolls.length === 0 ? (
                  <div className="col-span-full p-8 text-center text-slate-500">დასრულებული გამოკითხვები არ არის.</div>
                ) : (
                  completedPolls.map(poll => (
                    <div 
                      key={poll.id} 
                      onClick={() => setSelectedPoll(poll)}
                      className="bg-white border border-slate-50 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-[2rem] ${poll.passed ? 'bg-emerald-500' : 'bg-red-400'}`}></div>
                      <div className="p-6 pl-8 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${poll.passed ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                            {poll.passed ? <Hammer size={24} /> : <Armchair size={24} />}
                          </div>
                          <div>
                            <h4 className="text-slate-900 font-black text-lg leading-tight group-hover:text-primary transition-colors">{poll.title}</h4>
                            {poll.document && (
                              <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mt-1">
                                <FileText size={14} /> დოკუმენტით
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-50">
                          <span className={`font-bold text-sm px-3 py-1 rounded-xl ${poll.passed ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                            {poll.passed ? 'მიღებულია' : 'უარყოფილია'}
                          </span>
                          {poll.document && (
                            <a 
                              href={poll.document} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center gap-1.5"
                            >
                              <FileText size={14} /> დოკუმენტი
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] w-full max-w-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative flex flex-col"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 h-10 w-10 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 pb-4 shrink-0 mt-2">
                <h2 className="text-2xl font-black text-slate-900">ახალი ინიციატივა</h2>
                <p className="text-sm font-bold text-slate-500 mt-1">შეავსეთ ინიციატივის დეტალები</p>
              </div>
              <form id="add-initiative-form" onSubmit={handleAddInitiative} className="flex flex-col flex-1" encType="multipart/form-data">
                <div className="p-8 pb-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">სათაური</label>
                    <input
                      type="text"
                      required
                      value={newPoll.title}
                      onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                      placeholder="მაგ. ახალი ლიფტის დამონტაჟება"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">აღწერა</label>
                    <textarea
                      required
                      value={newPoll.description}
                      onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold min-h-[120px] resize-none transition-all"
                      placeholder="აღწერეთ ინიციატივის დეტალები, უპირატესობები და დანახარჯები..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">ხანგრძლივობა (დღე)</label>
                      <div className="relative flex items-center">
                        <button type="button" onClick={() => setNewPoll(p => ({...p, duration: Math.max(1, p.duration - 1)}))} className="absolute left-2 w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-white/50">
                          <span className="text-xl font-bold leading-none">-</span>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          required
                          value={newPoll.duration}
                          onChange={(e) => setNewPoll({ ...newPoll, duration: parseInt(e.target.value) || 1 })}
                          className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-14 py-4 text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button type="button" onClick={() => setNewPoll(p => ({...p, duration: Math.min(30, p.duration + 1)}))} className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-white/50">
                          <span className="text-xl font-bold leading-none">+</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">მინიმალური მომხრე %</label>
                      <div className="relative flex items-center">
                        <button type="button" onClick={() => setNewPoll(p => ({...p, passing_percentage: Math.max(1, p.passing_percentage - 1)}))} className="absolute left-2 w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-white/50">
                          <span className="text-xl font-bold leading-none">-</span>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={newPoll.passing_percentage}
                          onChange={(e) => setNewPoll({ ...newPoll, passing_percentage: parseInt(e.target.value) || 1 })}
                          className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-14 py-4 text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button type="button" onClick={() => setNewPoll(p => ({...p, passing_percentage: Math.min(100, p.passing_percentage + 1)}))} className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-white/50">
                          <span className="text-xl font-bold leading-none">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">საჭირო ბიუჯეტი (₾)</label>
                      <input
                        type="number"
                        min="0"
                        value={newPoll.budget || ''}
                        onChange={(e) => setNewPoll({ ...newPoll, budget: e.target.value ? parseInt(e.target.value) : 0 })}
                        className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">თითო მოსახლეზე საჭირო თანხა</label>
                      <div className="w-full bg-slate-50/50 border border-slate-200/50 shadow-inner rounded-2xl px-5 py-4 font-bold text-slate-500 truncate flex items-center justify-between">
                        <span>{costPerResident > 0 ? `${costPerResident} ₾` : 'არ არის საჭირო'}</span>
                        {costPerResident > 0 && (
                          <span className="text-xs font-semibold text-slate-400">
                            (გაყოფილი {newPoll.owners_only ? userStats.total_owners : userStats.total_residents}-ზე)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl p-5 shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">მხოლოდ მფლობელები</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">ხმის გაცემა შეეძლებათ მხოლოდ მესაკუთრეებს</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setNewPoll(prev => ({ ...prev, owners_only: !prev.owners_only }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary/20 ${newPoll.owners_only ? 'bg-primary' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newPoll.owners_only ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-6 flex gap-4 shrink-0 mt-auto">
                <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-white/60 text-slate-600 rounded-2xl font-bold border border-white/50 hover:bg-white transition-all shadow-sm">
                  <FileText size={20} className="text-slate-400" />
                  <span className="truncate">
                    {documentFile ? documentFile.name : 'PDF / DOC ატვირთვა'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDocumentFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <button
                  type="submit"
                  form="add-initiative-form"
                  className="flex-1 px-4 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 active:scale-[0.98] transition-all"
                >
                  გამოქვეყნება
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPoll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setSelectedPoll(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/50 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative flex flex-col"
            >
              <button onClick={() => setSelectedPoll(null)} className="absolute top-6 right-6 h-10 w-10 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm z-10">
                <X size={20} />
              </button>
              
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-white/60 border border-white/50 rounded-2xl mx-auto flex items-center justify-center shadow-sm overflow-hidden mt-2">
                  {selectedPoll.image ? (
                    <img src={selectedPoll.image} alt={selectedPoll.title} className="w-full h-full object-cover" />
                  ) : (
                    <Vote size={40} className="text-primary/60" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 line-clamp-2 leading-tight">{selectedPoll.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-3">{selectedPoll.description}</p>
                </div>

                <div className="bg-white/50 border border-white/50 rounded-2xl p-5 text-left space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50/50 rounded-xl text-slate-400">
                        <Vote size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">სტატუსი</span>
                    </div>
                    {selectedPoll.is_active ? (
                      <span className="text-sm font-bold text-blue-600 bg-blue-50/50 px-3 py-1 rounded-xl">აქტიური</span>
                    ) : (
                      <span className={`text-sm font-bold px-3 py-1 rounded-xl ${selectedPoll.passed ? 'text-emerald-600 bg-emerald-50/50' : 'text-red-500 bg-red-50/50'}`}>
                        {selectedPoll.passed ? 'მიღებულია' : 'უარყოფილია'}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-slate-100/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50/50 rounded-xl text-slate-400">
                        <Clock size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">დასრულება</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {new Date(selectedPoll.end_date).toLocaleDateString('ka-GE')}
                    </span>
                  </div>

                  {selectedPoll.budget > 0 && (
                    <div className="flex justify-between items-center border-b border-slate-100/50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50/50 rounded-xl text-slate-400">
                          <span className="font-bold">₾</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ბიუჯეტი</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {selectedPoll.budget.toLocaleString()} ₾
                      </span>
                    </div>
                  )}

                  {selectedPoll.owners_only && (
                    <div className="flex justify-between items-center border-b border-slate-100/50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">უფლება</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
                        მესაკუთრეები
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50/50 rounded-xl text-slate-400">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">საჭიროა {selectedPoll.passing_percentage}%</span>
                      </div>
                      <div className="flex gap-2 text-sm font-bold text-slate-800">
                        <span className="text-emerald-500">{selectedPoll.total_votes > 0 ? Math.round((selectedPoll.yes_votes / selectedPoll.total_votes) * 100) : 0}% კი</span>
                        <span className="text-red-500">{selectedPoll.total_votes > 0 ? Math.round((selectedPoll.no_votes / selectedPoll.total_votes) * 100) : 0}% არა</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2 mt-1 overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-1000 bg-emerald-500`} 
                        style={{ width: `${selectedPoll.total_votes > 0 ? (selectedPoll.yes_votes / selectedPoll.total_votes) * 100 : 0}%` }}
                      ></div>
                      <div 
                        className={`h-full transition-all duration-1000 bg-red-500`} 
                        style={{ width: `${selectedPoll.total_votes > 0 ? (selectedPoll.no_votes / selectedPoll.total_votes) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {selectedPoll.document && (
                  <a 
                    href={selectedPoll.document} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full py-4 mt-2 bg-white/60 hover:bg-white text-slate-700 font-bold rounded-2xl transition-colors border border-white/50 shadow-sm"
                  >
                    <FileText size={18} className="text-slate-400" />
                    ოფიციალური დოკუმენტი
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletingPollId && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setDeletingPollId(null)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-[2rem] w-full max-w-sm shadow-[0_8px_32px_rgba(239,68,68,0.2)] p-8 text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-16 h-16 bg-red-500/20 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-500/30">
                        <X size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">გამოკითხვის წაშლა</h3>
                    <p className="text-sm font-bold text-slate-600 mb-8">
                        ნამდვილად გსურთ ამ გამოკითხვის წაშლა? ეს ქმედება შეუქცევადია.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeletingPollId(null)}
                            className="flex-1 py-3.5 px-4 bg-white/50 hover:bg-white/80 border border-red-500/10 text-slate-700 rounded-xl font-bold transition-all"
                        >
                            გაუქმება
                        </button>
                        <button
                            onClick={confirmDeletePoll}
                            className="flex-1 py-3.5 px-4 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
                        >
                            წაშლა
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
