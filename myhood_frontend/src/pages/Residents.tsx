import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  Wrench,
  DoorOpen,
  Wallet,
  Settings,
  User,
  Bell,
  Menu,
  ChevronRight,
  LogOut,
  Users,
  Search,
  X,
  Phone,
  UserCheck,
  Hash,
  Building2,
  Vote,
  FileText,
  HeartHandshake
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
      <SidebarLink icon={<FileText size={22} />} label="დოკუმენტები" to="/documents" active={activePage === 'documents'} />
      <SidebarLink icon={<HeartHandshake size={22} />} label="სამეზობლო" to="/neighborhood" active={activePage === 'neighborhood'} />
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

const HeaderMobile = ({ handleLogout, userData }: { handleLogout: () => void, userData: any }) => (
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

export default function Residents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedResident, setSelectedResident] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
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

    const fetchResidents = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/residents/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setResidents(data);
        } else if (response.status === 401) {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching residents', err);
      }
    };
    fetchUserData();
    fetchResidents();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Extract unique floors, sorted numerically
  const floors = Array.from(new Set(residents.map(r => r.floor).filter(Boolean)))
    .sort((a: any, b: any) => parseInt(a) - parseInt(b));

  const filteredResidents = activeTab === 'all' 
    ? residents 
    : residents.filter(r => r.floor === activeTab);

  // Function to determine border color based on some logic (e.g. resident id or floor)
  const getBorderColor = (index: number) => {
    const colors = ['bg-[#10b981]', 'bg-[#3b82f6]', 'bg-[#8b5cf6]', 'bg-[#f59e0b]', 'bg-[#ef4444]'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen text-slate-900 flex">
      <Sidebar userData={userData} activePage="residents" />
      
      <div className="flex-1 flex flex-col min-h-screen grow w-full max-w-7xl mx-auto">
        <HeaderMobile handleLogout={handleLogout} userData={userData} />
        
        <main className="flex-1 px-6 lg:px-12 py-10 w-full overflow-y-auto">
          {/* Top Bar */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">მაცხოვრებლები</h1>
              <p className="text-slate-500 text-lg font-medium max-w-2xl">მეზობლების დირექტორია</p>
            </motion.div>
            <div className="hidden sm:flex items-center gap-4 relative">
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

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'all' 
                ? 'border-[#3b82f6] text-[#3b82f6]' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              ყველა
            </button>
            {floors.map(floor => (
              <button 
                key={floor}
                onClick={() => setActiveTab(floor)}
                className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === floor 
                  ? 'border-[#3b82f6] text-[#3b82f6]' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                სართული {floor}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredResidents.map((resident, idx) => (
                <motion.div
                  key={resident.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedResident(resident)}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full ${getBorderColor(idx)}`}></div>
                  
                  <div className="flex items-center justify-between mb-8 pl-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <User size={24} />
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {resident.apartment_number}
                    </div>
                  </div>

                  <div className="pl-4 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {resident.first_name[0]}. {resident.last_name}
                    </h3>
                  </div>

                  <div className="mt-auto pl-4 border-t border-slate-50 pt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      სართული {resident.floor}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredResidents.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                ჩანაწერები არ მოიძებნა
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedResident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setSelectedResident(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/50 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative"
            >
              <button 
                onClick={() => setSelectedResident(null)} 
                className="absolute top-6 right-6 h-10 w-10 bg-white/50 border border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-white/60 border border-white/50 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                  <User size={40} className="text-primary/40" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedResident.first_name} {selectedResident.last_name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">მაცხოვრებლის პროფილი</p>
                </div>

                <div className="bg-white/50 border border-white/50 rounded-2xl p-5 text-left space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                        <Hash size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">ბინა</span>
                    </div>
                    <span className="text-base font-bold text-slate-800">{selectedResident.apartment_number}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                        <Phone size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">ტელეფონი</span>
                    </div>
                    <span className="text-base font-bold text-slate-800">{selectedResident.phone_number || 'არ არის მითითებული'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                        <UserCheck size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">სტატუსი</span>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-xl ${
                      selectedResident.residential_status === 'OWNER' 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-blue-600 bg-blue-50'
                    }`}>
                      {selectedResident.residential_status === 'OWNER' ? 'მესაკუთრე' : 'არა მესაკუთრე'}
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
