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
  Plus, 
  LogOut,
  X,
  MessageCircle,
  Clock,
  Send,
  Trash2,
  HeartHandshake
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

export default function Neighborhood() {
  const [userData, setUserData] = useState<{ id?: number, first_name?: string, last_name?: string, apartment_number?: string } | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'ACTIVITY',
    dateMode: 'today' as 'today' | 'tomorrow' | 'custom',
    customDate: ''
  });
  
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const fetchActivities = async (token: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/neighborhood/activities/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setActivities(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActivityDetails = async (id: string) => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/neighborhood/activities/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            setActiveActivity(await response.json());
        }
      } catch (e) { console.error(e) }
  }

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

    fetchUserData();
    fetchActivities(token);
  }, [navigate]);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    // Calculate end_date based on dateMode
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 0);
    if (newActivity.dateMode === 'tomorrow') {
      endDate.setDate(endDate.getDate() + 1);
    } else if (newActivity.dateMode === 'custom' && newActivity.customDate) {
      const [y, m, d] = newActivity.customDate.split('-').map(Number);
      endDate = new Date(y, m - 1, d, 23, 59, 59, 0);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/neighborhood/activities/', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: newActivity.title,
            description: newActivity.description,
            type: newActivity.type,
            end_date: endDate.toISOString()
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewActivity({ title: '', description: '', type: 'ACTIVITY', dateMode: 'today', customDate: '' });
        fetchActivities(token);
      } else {
        const err = await response.json();
        alert('შეცდომა მატებისას: ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const handleParticipate = async (activityId: string) => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) return;
      try {
          const response = await fetch(`http://127.0.0.1:8000/api/neighborhood/activities/${activityId}/participate/`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
              fetchActivities(token);
              if (activeActivity && activeActivity.id === activityId) {
                  fetchActivityDetails(activityId);
              }
          }
      } catch (e) { console.error(e) }
  };

  const handleAddComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeActivity || !newComment.trim()) return;
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) return;

      try {
          const response = await fetch(`http://127.0.0.1:8000/api/neighborhood/comments/`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  activity: activeActivity.id,
                  text: newComment
              })
          });
          if (response.ok) {
              setNewComment('');
              fetchActivityDetails(activeActivity.id);
          }
      } catch (e) { console.error(e) }
  };

  const handleDeleteActivity = (id: string) => {
      setDeletingId(id);
  };

  const confirmDeleteActivity = async () => {
    if (!deletingId) return;
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/neighborhood/activities/${deletingId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDeletingId(null);
        if (activeActivity?.id === deletingId) {
            setActiveActivity(null);
        }
        fetchActivities(token);
      } else {
        const err = await response.json();
        alert(err.detail || 'შეცდომა წაშლისას');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-display relative selection:bg-primary/20 selection:text-primary">
      <Sidebar userData={userData} activePage="neighborhood" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderMobile handleLogout={handleLogout} />

        {/* Top Header for Desktop */}
         <header className="hidden lg:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-5 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">სამეზობლო</h1>
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
                <h1 className="text-slate-900 text-3xl font-black tracking-tight mb-2">აქტივობები და მოთხოვნები</h1>
                <p className="text-slate-500 font-bold text-sm md:text-base">დაუკავშირდით მეზობლებს - გააზიარეთ აქტივობები, იკითხეთ რჩევები ან შექმენით მოთხოვნები.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-blue-600 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] shrink-0 w-full md:w-auto"
              >
                <Plus size={20} />
                ახალი პოსტი
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {activities.length === 0 ? (
                   <div className="col-span-full p-12 text-center text-slate-500 bg-white border border-slate-100 rounded-[2.5rem]">
                       ჯერჯერობით არანაირი აქტივობა არ არის. დაამატეთ პირველი!
                   </div>
               ) : (
                   activities.map(activity => {
                       const isRequest = activity.type === 'REQUEST';
                       const daysRemaining = Math.max(0, Math.ceil((new Date(activity.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
                       const themeBase = isRequest ? 'indigo' : 'emerald';

                       return (
                           <div 
                               key={activity.id}
                               onClick={() => fetchActivityDetails(activity.id)}
                               className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden flex flex-col cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all h-full"
                           >
                               <div className={`p-6 flex flex-col flex-1 border-t-4 border-${themeBase}-500`}>
                                   <div className="flex justify-between items-start mb-4 gap-2">
                                       <span className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-${themeBase}-50 text-${themeBase}-600 border border-${themeBase}-100`}>
                                           {isRequest ? 'მოთხოვნა' : 'აქტივობა'}
                                       </span>
                                       <div className="flex gap-2">
                                            {String(userData?.id) === String(activity.created_by) && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteActivity(activity.id); }}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                                                <Clock size={14} /> {daysRemaining} დღე
                                            </span>
                                       </div>
                                   </div>

                                   <h3 className="text-slate-900 text-xl font-black leading-tight mb-2 line-clamp-2">{activity.title}</h3>
                                   <p className="text-slate-500 text-sm font-semibold mb-6 line-clamp-3 flex-1">{activity.description}</p>

                                   <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-4">
                                       <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {activity.creator_name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{activity.creator_name}</span>
                                       </div>

                                       <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                                                <MessageCircle size={16} /> {activity.comments.length}
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleParticipate(activity.id); }}
                                                className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                                                    activity.is_participating ? `bg-${themeBase}-50 text-${themeBase}-600` : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                                }`}
                                            >
                                                <HeartHandshake size={16} /> 
                                                {activity.is_participating ? 'ვმონაწილეობ' : activity.participations_count}
                                            </button>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       )
                   })
               )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] w-full max-w-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-8 pb-4 shrink-0 mt-2 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">ახალი პოსტი</h2>
                            <p className="text-sm font-bold text-slate-500 mt-1">შეავსეთ ინფორმაცია და გააზიარეთ სამეზობლოში</p>
                        </div>
                    </div>
                
                    <form onSubmit={handleAddActivity} className="flex flex-col flex-1 p-8 pt-4 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex items-center justify-center py-4 px-4 rounded-2xl cursor-pointer font-bold transition-all border-2 ${newActivity.type === 'ACTIVITY' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white/60 border-transparent text-slate-500 hover:bg-white'}`}>
                                <input type="radio" name="type" value="ACTIVITY" checked={newActivity.type === 'ACTIVITY'} onChange={(e) => setNewActivity({...newActivity, type: e.target.value})} className="hidden" />
                                📌 აქტივობა
                            </label>
                            <label className={`flex items-center justify-center py-4 px-4 rounded-2xl cursor-pointer font-bold transition-all border-2 ${newActivity.type === 'REQUEST' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white/60 border-transparent text-slate-500 hover:bg-white'}`}>
                                <input type="radio" name="type" value="REQUEST" checked={newActivity.type === 'REQUEST'} onChange={(e) => setNewActivity({...newActivity, type: e.target.value})} className="hidden" />
                                ✋ მოთხოვნა
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">სათაური</label>
                            <input
                            type="text"
                            required
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                            className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                            placeholder="რაზე აკეთებთ პოსტს?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">აღწერა</label>
                            <textarea
                            required
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold min-h-[120px] resize-none transition-all"
                            placeholder="დამატებითი დეტალები..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">ვადა</label>
                            <div className="flex bg-white/60 border border-white/60 shadow-sm rounded-2xl overflow-hidden p-1 gap-1">
                                {(['today', 'tomorrow', 'custom'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setNewActivity({...newActivity, dateMode: mode, customDate: mode !== 'custom' ? '' : newActivity.customDate})}
                                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                                            newActivity.dateMode === mode ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-white'
                                        }`}
                                    >
                                        {mode === 'today' ? 'დღეს' : mode === 'tomorrow' ? 'ხვალ' : '📅 თარიღი'}
                                    </button>
                                ))}
                            </div>
                            {newActivity.dateMode === 'custom' && (
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={newActivity.customDate}
                                    onChange={(e) => setNewActivity({...newActivity, customDate: e.target.value})}
                                    className="mt-3 w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 px-4 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 active:scale-[0.98] transition-all"
                        >
                            გამოქვეყნება
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Details & Comments Modal */}
      <AnimatePresence>
          {activeActivity && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setActiveActivity(null)}
              >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] w-full max-w-2xl h-[100dvh] md:max-h-[85vh] shadow-2xl relative flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 md:p-8 flex justify-between items-start border-b border-slate-100 bg-white/50 sticky top-0 z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${activeActivity.type === 'REQUEST' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                    {activeActivity.type === 'REQUEST' ? 'მოთხოვნა' : 'აქტივობა'}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    {new Date(activeActivity.created_at).toLocaleDateString('ka-GE')}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{activeActivity.title}</h2>
                            <p className="text-slate-600 mt-2 font-medium leading-relaxed">{activeActivity.description}</p>
                            
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    {activeActivity.creator_name.charAt(0)}
                                </div>
                                <span className="text-sm font-bold text-slate-700">ავტორი: {activeActivity.creator_name}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0">
                            <button 
                                onClick={() => setActiveActivity(null)} 
                                className="h-10 w-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors shadow-sm"
                            >
                                <X size={20} />
                            </button>
                            {String(userData?.id) === String(activeActivity.created_by) && (
                                <button
                                    onClick={() => handleDeleteActivity(activeActivity.id)}
                                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors mt-auto"
                                    title="პოსტის წაშლა"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 space-y-6">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <MessageCircle size={18} className="text-slate-400" />
                            მიმოწერა ({activeActivity.comments.length})
                        </h4>
                        
                        <div className="space-y-4">
                            {activeActivity.comments.length === 0 ? (
                                <div className="text-center p-6 text-slate-400 text-sm font-bold bg-white/50 rounded-2xl">ჯერ არ არის კომენტარები</div>
                            ) : (
                                activeActivity.comments.map((comment: any) => (
                                    <div key={comment.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-slate-800 text-sm block">{comment.author_name}</span>
                                                {comment.author_info && (
                                                    <span className="text-xs font-semibold text-slate-400">{comment.author_info}</span>
                                                )}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-400 ml-3 shrink-0">
                                                {new Date(comment.created_at).toLocaleTimeString('ka-GE', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-sm mt-1">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-6 bg-white border-t border-slate-100">
                         <form onSubmit={handleAddComment} className="flex gap-3">
                             <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="დაწერეთ კომენტარი..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all text-sm"
                             />
                             <button type="submit" disabled={!newComment.trim()} className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
                                 <Send size={18} className="ml-0.5" />
                             </button>
                         </form>
                    </div>
                </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setDeletingId(null)}
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
                    <h3 className="text-xl font-black text-slate-900 mb-2">პოსტის წაშლა</h3>
                    <p className="text-sm font-bold text-slate-600 mb-8">
                        ნამდვილად გსურთ ამ პოსტის წაშლა? ეს ქმედება შეუქცევადია.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeletingId(null)}
                            className="flex-1 py-3.5 px-4 bg-white/50 hover:bg-white/80 border border-red-500/10 text-slate-700 rounded-xl font-bold transition-all"
                        >
                            გაუქმება
                        </button>
                        <button
                            onClick={confirmDeleteActivity}
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
