import React, { useState, useEffect } from 'react';
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
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            m
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">myhood</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">გასვლა</span>
          </button>
          <button className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 flex justify-center items-start pt-10">
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
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="space-y-1.5 col-span-4 sm:col-span-1">
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
                    <div className="space-y-1.5 col-span-4 sm:col-span-1">
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
  );
}
