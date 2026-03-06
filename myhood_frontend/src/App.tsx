import { useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  IdCard, 
  Building, 
  Layers, 
  DoorOpen, 
  Phone, 
  UserCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
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
    terms: false,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
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
        phone_number: formData.phone_number
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
                floor: '', apartment_number: '', phone_number: '', terms: false
            });
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
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8 text-primary">
          <Building2 size={64} strokeWidth={1.5} />
          <h1 className="text-slate-900 text-4xl font-extrabold leading-none tracking-tight">myhood</h1>
        </div>

        {/* Card Section */}
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-50">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <UserPlus className="text-primary" size={32} />
              რეგისტრაცია
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

            {/* Line 3: Personal Number, City */}
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ქალაქი</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="თბილისი" 
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line 4: Street, District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">ქუჩა</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="ჭავჭავაძის გამზ." 
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">უბანი</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
                    placeholder="ვაკე" 
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl form-input-focus text-base" 
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

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-sm text-slate-600 font-medium">
                ვეთანხმები წესებს და პირობებს
              </label>
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
        </div>
      </motion.div>
    </div>
  );
}
