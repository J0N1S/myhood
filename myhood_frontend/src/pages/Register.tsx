import React, { useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  IdCard, 
  Building, 
  Layers, 
  DoorOpen, Phone, UserCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import SignatureCheckbox from '../components/SignatureCheckbox';

const TBILISI_DISTRICTS = [
  'აბანოთუბანი', 'ავშნიანი', 'ავჭალა', 'ავლაბარი', 'აეროპორტის დას.', 
  'აფრიკა', 'ახალდაბა', 'ბაგები', 'ბეთანია', 'გლდანი', 'გლდანულა', 
  'გიორგიწმინდას დას.', 'დამპალოს დას.', 'დიდგორი', 'დიდი დიღომი', 
  'დიდუბე', 'დიღმის მასივი', 'დიღმის ჭალა', 'დიღომი 1-9', 'ელია', 
  'ვარკეთილი', 'ვაზისუბანი', 'ვაკე', 'ვაშლიჯვარი', 'ვეძისი', 'ვერა',
  'ზაჰესი', 'ზემო ლისი', 'თბილისის ზღვა', 'თემქა', 'თხინვალი', 'ივერთუბანი', 
  'ისანი', 'კაკლები', 'კვესეთი', 'კიკეთი', 'კონიაკის დას.', 'კოჯორი', 
  'კრწანისი', 'კუკია', 'კუს ტბა', 'ლილო', 'ლისი', 'ლისის მიმდებარედ', 
  'ლოტკინი', 'მესამე მასივი', 'მთაწმინდა', 'მოსკოვის გამზირი', 'მსხალდიდი', 
  'მუხათგვერდი', 'მუხათწყარო', 'მუხიანი', 'ნავთლუღი', 'ნაძალადევი', 
  'ნუცუბიძის ფერდობი', 'ორთაჭალა', 'ორხევი', 'ოქროყანა', 'რუსთაველი', 
  'საბურთალო', 'სამგორი', 'სან. ზონა', 'სვანეთის უბანი', 'სოლოლაკი', 
  'სოფ. გლდანი', 'სოფ. დიღომი', 'ტაბახმელა', 'ფონიჭალა', 'ქოშიგორა', 
  'შავნაბადა', 'შინდისი', 'ჩუღურეთი', 'ცენტრი', 'წავკისი', 'წავკისის ველი', 
  'წვერი', 'წოდორეთი', 'წყნეთი', 'ჭავჭავაძე', 'ხუდადოვი', 'ძველი თბილისი'
].sort();

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    personal_number: '',
    city: '',
    street: '',
    district: '',
    building_number: '',
    floor: '',
    apartment_number: '',
    phone_number: '',
    residential_status: 'OWNER',
    terms: false,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const CITIES = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი'];
  const STATUSES = [
    { label: 'მესაკუთრე', value: 'OWNER' },
    { label: 'არა მესაკუთრე', value: 'TENANT' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (formData.password !== formData.passwordConfirm) {
        setStatus('error');
        setErrorMessage('პაროლები არ ემთხვევა');
        return;
    }

    if (!formData.terms) {
        setStatus('error');
        setErrorMessage('გთხოვთ, დაეთანხმოთ წესებს და პირობებს');
        return;
    }

    const payload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        personal_number: formData.personal_number,
        city: formData.city,
        street: formData.street,
        district: formData.district,
        address: `${formData.city}, ${formData.street}, ${formData.district}`,
        building_number: formData.building_number,
        floor: formData.floor,
        apartment_number: formData.apartment_number,
        phone_number: formData.phone_number,
        residential_status: formData.residential_status
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            setStatus('success');
            // Reset form
            setFormData({
                email: '', password: '', passwordConfirm: '', firstName: '', lastName: '', 
                personal_number: '', city: '', street: '', district: '', building_number: '', 
                floor: '', apartment_number: '', phone_number: '', residential_status: 'OWNER', terms: false
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            setStatus('error');
            // Extract error message
            const firstErrorKey = Object.keys(data)[0];
            setErrorMessage(data[firstErrorKey][0] || 'რეგისტრაცია ვერ მოხერხდა');
        }
    } catch (error) {
        setStatus('error');
        setErrorMessage('სერვერთან კავშირი ვერ მოხერხდა');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Card Section */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-50">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <UserPlus className="text-primary" size={32} />
              მოგესალმებით სამეზობლოში
            </h2>
          </div>

          {/* Form */}
          <form className="p-6 sm:p-8 space-y-5" onSubmit={handleSubmit}>
            {status === 'success' && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-semibold">
                რეგისტრაცია წარმატებით დასრულდა! ახლა შეგიძლიათ დალოგინდეთ.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold">
                {errorMessage}
              </div>
            )}
            {/* Line 1: First Name, Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">სახელი</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="გიორგი" 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">გვარი</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="მაისურაძე" 
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line 2: Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ელ-ფოსტა</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="example@mail.com" 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ტელეფონი</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base font-mono tracking-wider" 
                    placeholder="599 12 34 56" 
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line 3: Personal Number, Residential Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">პირადი ნომერი</label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base font-mono tracking-wider" 
                    placeholder="01011012345" 
                    type="text"
                    name="personal_number"
                    value={formData.personal_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5 z-20">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ბინადრის სტატუსი</label>
                <div className="relative">
                  <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <button 
                    type="button"
                    onClick={() => setIsStatusModalOpen(true)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base text-left flex justify-between items-center"
                  >
                    <span className="text-slate-800 font-medium">
                      {formData.residential_status === 'OWNER' ? 'მესაკუთრე' : 'არა მესაკუთრე'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Line 4: City, District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 z-20">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ქალაქი</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <button 
                    type="button"
                    onClick={() => setIsCityModalOpen(true)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base text-left flex justify-between items-center"
                  >
                    <span className={formData.city ? "text-slate-800 font-medium" : "text-slate-400 font-medium"}>
                      {formData.city || 'აირჩიეთ ქალაქი'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">უბანი</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  {formData.city === 'თბილისი' ? (
                    <button 
                      type="button"
                      onClick={() => setIsDistrictModalOpen(true)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-base text-left flex justify-between items-center"
                    >
                      <span className={formData.district ? "text-slate-800 font-medium" : "text-slate-400 font-medium"}>
                        {formData.district || 'აირჩიეთ უბანი'}
                      </span>
                    </button>
                  ) : (
                    <input 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                      placeholder="მაგ: ვაკე" 
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Line 5: Street, Building, Floor, Apartment */}
            <div className="grid grid-cols-6 gap-4">
              <div className="space-y-1.5 col-span-6 sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ქუჩა</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="ჭავჭავაძის გამზ." 
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">კორპუსი</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="A" 
                    type="text"
                    name="building_number"
                    value={formData.building_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">სართული</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="5" 
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ბინა</label>
                <div className="relative">
                  <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="42" 
                    type="text"
                    name="apartment_number"
                    value={formData.apartment_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line 6: Passwords */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">პაროლი</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                      placeholder="••••••••" 
                      type="password"
                      name="password"
                      value={formData.password}
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
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl form-input-focus text-base ${
                        formData.passwordConfirm && formData.password !== formData.passwordConfirm 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                          : 'border-slate-100'
                      }`}
                      placeholder="••••••••" 
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                <p className="text-sm text-red-500 font-medium ml-1">პაროლები არ ემთხვევა ერთმანეთს.</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <SignatureCheckbox 
                checked={formData.terms}
                onChange={(checked) => setFormData({ ...formData, terms: checked })}
                label="ვეთანხმები წესებს და პირობებს"
              />
            </div>

            <div className="pt-4">
              <button 
                className="w-full bg-primary hover:bg-primary-600 text-white py-4 px-6 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50" 
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'მიმდინარეობს...' : 'რეგისტრაცია'}
                <UserCheck size={24} />
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              უკვე გაქვთ ანგარიში? 
              <Link to="/login" className="ml-2 text-primary font-bold hover:underline">ავტორიზაცია</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* City Selection Modal (Left Offset) */}
      <AnimatePresence>
        {isCityModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setIsCityModalOpen(false)}
            />
            <div className="relative w-full max-w-sm z-10 lg:absolute lg:right-[calc(50%+300px)] flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-full bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary/10 rounded-[2.5rem] overflow-hidden flex flex-col"
              >
                <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Building className="text-primary" size={24} /> აირჩიეთ ქალაქი
                  </h3>
                  <button 
                    type="button" onClick={() => setIsCityModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  ><X size={20} /></button>
                </div>
                <div className="p-6 sm:p-8 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-3">
                    {CITIES.map(city => (
                      <button
                        key={city} type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, city, district: city !== 'თბილისი' ? '' : prev.district }));
                          setIsCityModalOpen(false);
                        }}
                        className={`text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                          formData.city === city 
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' 
                          : 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-white hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >{city}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* District Selection Modal (Right Offset) */}
      <AnimatePresence>
        {isDistrictModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setIsDistrictModalOpen(false)}
            />
            <div className="relative w-full max-w-lg z-10 lg:absolute lg:left-[calc(50%+300px)] flex justify-center lg:justify-start">
              <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-full bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Building className="text-primary" size={24} /> აირჩიეთ תბილისის უბანი
                  </h3>
                  <button 
                    type="button" onClick={() => setIsDistrictModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  ><X size={20} /></button>
                </div>
                <div className="p-6 sm:p-8 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TBILISI_DISTRICTS.map(dist => (
                      <button
                        key={dist} type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, district: dist }));
                          setIsDistrictModalOpen(false);
                        }}
                        className={`text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                          formData.district === dist 
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' 
                          : 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-white hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >{dist}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Residential Status Modal (Right Offset) */}
      <AnimatePresence>
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setIsStatusModalOpen(false)}
            />
            <div className="relative w-full max-w-sm z-10 lg:absolute lg:left-[calc(50%+300px)] flex justify-center lg:justify-start">
              <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-full bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary/10 rounded-[2.5rem] overflow-hidden flex flex-col"
              >
                <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <UserCheck className="text-primary" size={24} /> ბინადრის სტატუსი
                  </h3>
                  <button 
                    type="button" onClick={() => setIsStatusModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  ><X size={20} /></button>
                </div>
                <div className="p-6 sm:p-8 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-3">
                    {STATUSES.map(stat => (
                      <button
                        key={stat.value} type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, residential_status: stat.value }));
                          setIsStatusModalOpen(false);
                        }}
                        className={`text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                          formData.residential_status === stat.value 
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' 
                          : 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-white hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >{stat.label}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
