import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  LogOut,
  X,
  Folder,
  Briefcase,
  Gavel,
  History,
  Image as ImageIcon,
  FileBox,
  CloudUpload,
  Search,
  Download
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

export default function Documents() {
  const [userData, setUserData] = useState<{ id?: number, first_name?: string, last_name?: string, apartment_number?: string } | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);
  
  // Active Folder viewing
  const [activeFolderDoc, setActiveFolderDoc] = useState<any | null>(null);

  const [newDoc, setNewDoc] = useState({ title: '', description: '', category: 'general', recorded_date: new Date().toISOString().split('T')[0], is_private: false });
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeYear, setActiveYear] = useState('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const fetchDocuments = async (token: string) => {
    try {
      let url = `http://127.0.0.1:8000/api/documents/?`;
      if (activeCategory !== 'all') url += `category=${activeCategory}&`;
      if (activeYear !== 'all') url += `year=${activeYear}&`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        
        // Extract unique years for the filter UI if loading all 
        if (activeCategory === 'all' && activeYear === 'all') {
             const years = new Set(data.map((d: any) => d.created_at_year));
             // @ts-ignore
             setAvailableYears(Array.from(years).sort((a,b) => b-a));
        }
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

    fetchUserData();
    fetchDocuments(token);
  }, [navigate, activeCategory, activeYear]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) {
        alert("გთხოვთ აირჩიოთ ფაილი.");
        return;
    }
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('title', newDoc.title);
    formData.append('category', newDoc.category);
    formData.append('recorded_date', newDoc.recorded_date);
    formData.append('is_private', newDoc.is_private.toString());
    if (newDoc.description) {
        formData.append('description', newDoc.description);
    }
    
    uploadFiles.forEach(file => {
        formData.append('files', file);
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/documents/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewDoc({ title: '', description: '', category: 'general', recorded_date: new Date().toISOString().split('T')[0], is_private: false });
        setUploadFiles([]);
        fetchDocuments(token);
      } else {
        const err = await response.json();
        alert('შეცდომა ატვირთვისას: ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error("Failed to upload:", error);
    }
  };

  const handleDelete = (docId: number) => {
      setDeletingDocId(docId);
  };

  const confirmDelete = async () => {
      if (!deletingDocId) return;
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/documents/${deletingDocId}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            setDeletingDocId(null);
            setActiveFolderDoc(null);
            fetchDocuments(token);
        } else {
            const err = await response.json();
            alert(err.detail || 'შეცდომა წაშლისას');
        }
      } catch (e) {
         console.error(e);
      }
  };

  const getCategoryTheme = (category: string) => {
      switch (category) {
          case 'financial':
              return { icon: <Briefcase size={24} />, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100', hoverBorder: 'hover:border-green-300' };
          case 'rules':
              return { icon: <Gavel size={24} />, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', hoverBorder: 'hover:border-red-300' };
          case 'protocols':
              return { icon: <History size={24} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', hoverBorder: 'hover:border-blue-300' };
          case 'general':
          default:
              return { icon: <Folder size={24} />, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', hoverBorder: 'hover:border-amber-300' };
      }
  };

  const getFileIcon = (extension: string | undefined) => {
      if (!extension) return { icon: <Folder size={24} />, color: 'text-amber-500', bg: 'bg-amber-50' };
      const ext = extension.toLowerCase();
      if (['pdf'].includes(ext)) return { icon: <FileText size={24} />, color: 'text-red-500', bg: 'bg-red-50' };
      if (['doc', 'docx'].includes(ext)) return { icon: <FileText size={24} />, color: 'text-blue-500', bg: 'bg-blue-50' };
      if (['jpg', 'jpeg', 'png'].includes(ext)) return { icon: <ImageIcon size={24} />, color: 'text-green-500', bg: 'bg-green-50' };
      if (['xls', 'xlsx'].includes(ext)) return { icon: <FileBox size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      return { icon: <FileText size={24} />, color: 'text-slate-500', bg: 'bg-slate-50' };
  };

  const formatFileSize = (bytes: number | undefined) => {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-display relative selection:bg-primary/20 selection:text-primary">
      <Sidebar userData={userData} activePage="documents" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderMobile handleLogout={handleLogout} />

         <header className="hidden lg:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-5 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">დოკუმენტები</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64 font-bold" 
                    placeholder="ფაილის ძებნა..." 
                    type="text"
                />
              </div>

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
            
            {/* Filters Row */}
            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                        onClick={() => setActiveCategory('all')} 
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                    >
                        ყველა
                    </button>
                    <button 
                        onClick={() => setActiveCategory('general')} 
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === 'general' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                    >
                        <Folder size={18} /> საერთო
                    </button>
                    <button 
                         onClick={() => setActiveCategory('financial')} 
                         className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === 'financial' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                    >
                        <Briefcase size={18} /> ფინანსური
                    </button>
                    <button 
                         onClick={() => setActiveCategory('rules')} 
                         className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === 'rules' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                    >
                        <Gavel size={18} /> წესდება
                    </button>
                    <button 
                         onClick={() => setActiveCategory('protocols')} 
                         className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === 'protocols' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                    >
                        <History size={18} /> ოქმები
                    </button>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">წელი:</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveYear('all')} 
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${activeYear === 'all' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                        >
                            ყველა
                        </button>
                        {availableYears.map(year => (
                            <button 
                                key={year}
                                onClick={() => setActiveYear(year.toString())} 
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${activeYear === year.toString() ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30'}`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div 
                onClick={() => setIsModalOpen(true)}
                className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 hover:border-primary/50 bg-white/50 hover:bg-primary/5 rounded-[2.5rem] transition-all cursor-pointer"
            >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all shadow-sm">
                    <CloudUpload size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">ფაილის ატვირთვა</h3>
                <p className="text-sm font-bold text-slate-500 mb-6">ნებისმიერი დოკუმენტის ან სურათის ასატვირთად დააკლიკეთ აქ</p>
                <div className="flex gap-3">
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl">PDF</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl">DOCX</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl">JPG/PNG</span>
                </div>
            </div>

            {/* Document List */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-xl text-slate-900">ბოლოს ატვირთული</h3>
                </div>
                
                {documents.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-slate-500 font-bold bg-white rounded-3xl border border-slate-100">დოკუმენტები არ მოიძებნა.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {documents.map(doc => {
                            const isFolder = doc.files && doc.files.length > 1;
                            const totalSize = doc.files?.reduce((acc: number, f: any) => acc + (f.file_size || 0), 0) || 0;
                            const { icon, color, bg, border, hoverBorder } = getCategoryTheme(doc.category);
                            
                            return (
                                <div 
                                    key={doc.id} 
                                    onClick={() => setActiveFolderDoc(doc)}
                                    className={`bg-white p-6 rounded-[2rem] border ${border} ${hoverBorder} shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all flex flex-col relative group cursor-pointer`}
                                >
                                    <div className="flex items-start justify-between mb-5">
                                        <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center ${color}`}>
                                            {icon}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {doc.is_private && (
                                                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg">
                                                    პრივატული
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <h4 className="font-black text-slate-900 text-lg mb-1 truncate leading-tight group-hover:text-primary transition-colors" title={doc.title}>{doc.title}</h4>
                                    <p className="text-xs text-slate-500 font-bold mb-3 truncate">ატვირთა: {doc.creator_name || 'მომხმარებელი'}</p>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                        <span>{doc.recorded_date || new Date(doc.created_at).toLocaleDateString('ka-GE')}</span>
                                        <span>{isFolder ? `${doc.files.length} ფაილი` : formatFileSize(totalSize)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="p-8 pb-4 shrink-0 mt-2">
                <h2 className="text-2xl font-black text-slate-900">ფაილის ატვირთვა</h2>
                <p className="text-sm font-bold text-slate-500 mt-1">შეავსეთ ინფორმაცია და აირჩიეთ ფაილი</p>
              </div>
              
              <form onSubmit={handleUpload} className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-8 pb-2 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">სათაური</label>
                    <input
                      type="text"
                      required
                      value={newDoc.title}
                      onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                      placeholder="მაგ. წესდების ვერსია 2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">აღწერა</label>
                    <textarea
                      value={newDoc.description}
                      onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all resize-none h-24"
                      placeholder="დამატებითი აღწერა..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">თარიღი</label>
                        <input
                          type="date"
                          required
                          value={newDoc.recorded_date}
                          onChange={(e) => setNewDoc({ ...newDoc, recorded_date: e.target.value })}
                          className="w-full bg-white/60 border border-white/60 shadow-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all cursor-pointer text-slate-700"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">კატეგორია</label>
                        <div className="relative">
                            <select
                            required
                            value={newDoc.category}
                            onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                            className="w-full bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all appearance-none cursor-pointer text-slate-700"
                            >
                                <option value="general">საერთო</option>
                                <option value="financial">ფინანსური</option>
                                <option value="rules">წესდება</option>
                                <option value="protocols">ოქმები</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                ▼
                            </div>
                        </div>
                      </div>
                  </div>

                  <div>
                      <label className="flex items-center gap-3 p-4 bg-white/60 border border-white/60 rounded-2xl cursor-pointer hover:bg-white/80 transition-all">
                          <input 
                              type="checkbox"
                              checked={newDoc.is_private}
                              onChange={(e) => setNewDoc({ ...newDoc, is_private: e.target.checked })}
                              className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-bold text-slate-700 select-none">პრივატული დოკუმენტი (მხოლოდ თქვენ დაინახავთ)</span>
                      </label>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">ფაილები</label>
                     <label className="flex flex-col items-center justify-center w-full min-h-[8rem] bg-white/60 border-2 border-dashed border-slate-300 hover:border-primary/50 hover:bg-primary/5 rounded-2xl cursor-pointer transition-all p-4">
                        <CloudUpload size={24} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-slate-600 text-center">
                            {uploadFiles.length > 0 ? `${uploadFiles.length} ფაილი არჩეულია` : 'დააკლიკეთ ასატვირთად'}
                        </span>
                        {uploadFiles.length > 0 && (
                            <span className="text-xs text-slate-400 mt-2 text-center max-w-[250px] truncate">
                                {Array.from(uploadFiles).map((f: File) => f.name).join(', ')}
                            </span>
                        )}
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const filesArray = Array.from(e.target.files);
                                    setUploadFiles(filesArray);
                                    if (!newDoc.title && filesArray.length === 1) {
                                        setNewDoc({...newDoc, title: filesArray[0].name.split('.')[0]});
                                    } else if (!newDoc.title && filesArray.length > 1) {
                                        setNewDoc({...newDoc, title: "ახალი კოლექცია"});
                                    }
                                }
                            }}
                        />
                     </label>
                  </div>
                </div>

                <div className="p-8 pt-6 mt-auto">
                    <button
                    type="submit"
                    className="w-full px-4 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 active:scale-[0.98] transition-all"
                    >
                    {uploadFiles.length > 1 ? 'ფოლდერის ატვირთვა' : 'ატვირთვა'}
                    </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeFolderDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setActiveFolderDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] w-full max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="p-8 pb-4 border-b border-white/40 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${getCategoryTheme(activeFolderDoc.category).bg} rounded-2xl flex items-center justify-center ${getCategoryTheme(activeFolderDoc.category).color} shrink-0`}>
                          {getCategoryTheme(activeFolderDoc.category).icon}
                      </div>
                      <div>
                          <h2 className="text-2xl font-black text-slate-900 leading-tight">{activeFolderDoc.title}</h2>
                          <p className="text-sm font-bold text-slate-500 mt-1">{activeFolderDoc.files?.length} ფაილი • {activeFolderDoc.recorded_date || new Date().toLocaleDateString('ka-GE')}</p>
                      </div>
                  </div>
                  {userData?.id === activeFolderDoc.created_by && (
                      <button onClick={() => handleDelete(activeFolderDoc.id)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all ml-4" title="დოკუმენტის წაშლა">
                          <X size={16} /> წაშლა
                      </button>
                  )}
              </div>
              
              <div className="overflow-y-auto p-8 space-y-4">
                  {activeFolderDoc.description && (
                      <div className="mb-6 p-5 bg-white/50 rounded-2xl border border-white/50 text-slate-600 font-medium text-sm">
                          {activeFolderDoc.description}
                      </div>
                  )}
                  
                  <div className="space-y-3">
                      {activeFolderDoc.files?.map((fileObj: any) => {
                          const { icon, color, bg } = getFileIcon(fileObj.file_extension);
                          return (
                          <div key={fileObj.id} className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all group">
                              <div className="flex items-center gap-4 truncate">
                                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center ${color} shrink-0`}>
                                      {React.cloneElement(icon, { size: 20 })}
                                  </div>
                                  <div className="flex flex-col truncate">
                                      <span className="font-bold text-slate-800 truncate" title={fileObj.original_name}>
                                          {fileObj.original_name}
                                      </span>
                                      <span className="text-xs font-bold text-slate-400">
                                          {fileObj.file_extension?.toUpperCase() || 'FILE'} • {formatFileSize(fileObj.file_size)}
                                      </span>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a href={fileObj.file} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all" title="ნახვა">
                                      <FileText size={16} />
                                  </a>
                                  <a href={fileObj.file} download className="p-2 bg-blue-50 hover:bg-primary text-primary hover:text-white rounded-xl transition-all" title="ჩამოტვირთვა">
                                      <Download size={16} />
                                  </a>
                              </div>
                          </div>
                          );
                      })}
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingDocId && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setDeletingDocId(null)}
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
                    <h3 className="text-xl font-black text-slate-900 mb-2">დოკუმენტის წაშლა</h3>
                    <p className="text-sm font-bold text-slate-600 mb-8">
                        ნამდვილად გსურთ დოკუმენტის წაშლა? ეს ქმედება შეუქცევადია.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeletingDocId(null)}
                            className="flex-1 py-3.5 px-4 bg-white/50 hover:bg-white/80 border border-red-500/10 text-slate-700 rounded-xl font-bold transition-all"
                        >
                            გაუქმება
                        </button>
                        <button
                            onClick={confirmDelete}
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
