import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Menu, 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  Building, 
  Layers, 
  DoorOpen,
  Camera,
  LogOut,
  Save,
  UserCheck,
  Ticket,
  Users,
  LayoutDashboard,
  Wrench,
  Wallet,
  Settings,
  ChevronRight,
  Bell,
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
            {userData ? `${userData.firstName} ${userData.lastName}` : 'მომხმარებელი'}
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

export default function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    personal_number: '',
    city: '',
    street: '',
    district: '',
    building_number: '',
    floor: '',
    apartment_number: '',
    residential_status: 'OWNER'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePassesCount, setActivePassesCount] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone_number: data.phone_number || '',
            personal_number: data.personal_number || '',
            city: data.city || '',
            street: data.street || '',
            district: data.district || '',
            building_number: data.building_number || '',
            floor: data.floor || '',
            apartment_number: data.apartment_number || '',
            residential_status: data.residential_status || 'OWNER'
          });

          // Fetch active passes count
          try {
            const passesRes = await fetch('http://127.0.0.1:8000/api/passes/active/', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (passesRes.ok) {
              const passesData = await passesRes.json();
              setActivePassesCount(Array.isArray(passesData) ? passesData.length : (passesData.count || 0));
            }
          } catch (e) {
            console.error('Error fetching active passes count', e);
          }

        } else if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone_number,
          personal_number: formData.personal_number,
          city: formData.city,
          street: formData.street,
          district: formData.district,
          building_number: formData.building_number,
          floor: formData.floor,
          apartment_number: formData.apartment_number,
          residential_status: formData.residential_status
        })
      });
      
      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fcfdfe]">
      <Sidebar userData={formData} activePage="profile" />

      <div className="flex-1 flex flex-col min-h-screen grow w-full max-w-7xl mx-auto">
        <HeaderMobile handleLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 px-6 lg:px-12 py-10 w-full overflow-y-auto">
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">პროფილი</h1>
              <p className="text-slate-500 text-lg font-medium max-w-2xl">თქვენი პერსონალური ინფორმაცია და პარამეტრები.</p>
            </motion.div>
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 p-3 px-5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-colors"
              >
                <LogOut size={18} />
                <span>გასვლა</span>
              </button>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
          {/* Left Column (Avatar & Quick Info) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50/50"></div>
              
              <div className="relative group mt-6 mb-4">
                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl shadow-blue-900/5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-extrabold uppercase overflow-hidden">
                    {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2.5 bg-white text-slate-700 hover:text-primary rounded-full shadow-lg border border-slate-100 transition-colors">
                  <Camera size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {formData.firstName} {formData.lastName}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wide">
                {formData.residential_status === 'OWNER' ? 'მესაკუთრე' : 'არა მესაკუთრე'}
              </div>

              <div className="w-full mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Building size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">მისამართი</p>
                    <p className="font-semibold text-slate-800 text-sm">
                      {formData.street}, {formData.building_number}-{formData.apartment_number}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ტელეფონი</p>
                    <p className="font-semibold text-slate-800 text-sm font-mono">{formData.phone_number}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => navigate('/passes')}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-primary transition-colors rounded-2xl py-3.5 px-4 flex items-center justify-between font-bold text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Ticket size={18} />
                      <span>აქტიური საშვი</span>
                    </div>
                    {activePassesCount > 0 && (
                      <span className="bg-primary text-white text-xs px-2.5 py-1 rounded-full font-mono">
                        {activePassesCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Form Details) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">პროფილის დეტალები</h3>
                  <p className="text-slate-500 font-medium mt-1">თქვენი პერსონალური ინფორმაცია</p>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isEditing 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                      : 'bg-blue-50 text-primary hover:bg-blue-100'
                  }`}
                >
                  {isEditing ? 'გაუქმება' : 'რედაქტირება'}
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleSave}>
                {/* Personal Info Group */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <User size={16} className="text-primary" /> პერსონალური მონაცემები
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">სახელი</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">გვარი</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">პირადი ნომერი</label>
                      <div className="relative">
                        <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          className="w-full px-5 py-3.5 pr-12 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 font-mono font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                          type="text"
                          name="personal_number"
                          value={formData.personal_number}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">ბინადრის სტატუსი</label>
                      <div className="relative">
                        <UserCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          className="w-full px-5 py-3.5 pr-12 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed appearance-none" 
                          name="residential_status"
                          value={formData.residential_status}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="OWNER">მესაკუთრე</option>
                          <option value="TENANT">არა მესაკუთრე</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">ელ-ფოსტა</label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          className="w-full px-5 py-3.5 pr-12 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">ტელეფონი</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          className="w-full px-5 py-3.5 pr-12 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-700 font-mono font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Group */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Building size={16} className="text-primary" /> საცხოვრებელი მისამართი
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">ქალაქი</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">უბანი</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-4 mt-4">
                    <div className="space-y-1.5 col-span-6 sm:col-span-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">ქუჩა</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">კორპუსი</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed" 
                        type="text"
                        name="building_number"
                        value={formData.building_number}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">სართული</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed text-center" 
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">ბინა</label>
                      <input 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary outline-none transition-all text-slate-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed text-center" 
                        type="text"
                        name="apartment_number"
                        value={formData.apartment_number}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-6 mt-6 border-t border-slate-100 flex justify-end"
                  >
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary-600 text-white py-3.5 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center gap-2"
                    >
                      <Save size={20} /> შენახვა
                    </button>
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
