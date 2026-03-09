import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Vote, IdCard, Users, FileText, Bell, ShieldCheck,
  Building2, ChevronDown, ArrowRight, Sparkles
} from 'lucide-react';

// ─── Mini building visualizer ──────────────────────────────────────────────
const FLOORS = 8;
const UNITS_PER_FLOOR = 5;

function BuildingViz() {
  const [lit, setLit] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);

  // Randomly light up windows on mount
  useEffect(() => {
    const initial = new Set<string>();
    for (let f = 0; f < FLOORS; f++) {
      for (let u = 0; u < UNITS_PER_FLOOR; u++) {
        if (Math.random() > 0.35) initial.add(`${f}-${u}`);
      }
    }
    setLit(initial);

    // Flicker animation
    const id = setInterval(() => {
      const key = `${Math.floor(Math.random() * FLOORS)}-${Math.floor(Math.random() * UNITS_PER_FLOOR)}`;
      setLit(prev => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative select-none">
      {/* Glow backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl scale-150" />

      <div className="flex flex-col-reverse gap-1.5">
        {Array.from({ length: FLOORS }, (_, floorIdx) => (
          <div key={floorIdx} className="flex gap-1.5 justify-center">
            {Array.from({ length: UNITS_PER_FLOOR }, (_, unitIdx) => {
              const key = `${floorIdx}-${unitIdx}`;
              const isLit = lit.has(key);
              const isHov = hovered === key;
              return (
                <motion.div
                  key={unitIdx}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  animate={{
                    backgroundColor: isHov
                      ? '#facc15'
                      : isLit
                      ? '#60a5fa'
                      : '#1e293b',
                    boxShadow: isLit
                      ? '0 0 12px 2px rgba(96,165,250,0.4)'
                      : 'none',
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-10 h-8 rounded-sm cursor-pointer relative overflow-hidden"
                >
                  {/* Window cross */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="absolute w-[1px] h-full bg-slate-300" />
                    <div className="absolute h-[1px] w-full bg-slate-300" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Base */}
      <div className="mt-2 h-3 bg-slate-700 rounded-b-lg mx-4" />
      {/* Ground */}
      <div className="h-1 bg-slate-800 rounded-full mx-2 mt-0.5" />

      {/* Floor label */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        {Array.from({ length: FLOORS }, (_, i) => (
          <div key={i} className="text-[10px] text-slate-500 font-bold w-12 text-left">
            {FLOORS - i}სართ.
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-3xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(48,153,251,0.12)] hover:-translate-y-1 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

// ─── Main Landing page ────────────────────────────────────────────────────
export default function Landing() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] overflow-x-hidden">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
              m
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">myhood</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl font-bold text-primary hover:bg-primary/10 transition-colors text-sm"
            >
              შესვლა
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-500 transition-colors text-sm shadow-lg shadow-primary/25 active:scale-95"
            >
              რეგისტრაცია
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left copy */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6"
          >
            <Sparkles size={16} />
            სმარტ-კორპუსის მართვა
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
          >
            შენი კორპუსი,{' '}
            <span className="text-primary">ჭკვიანად</span>{' '}
            მართული
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
          >
            MyHood — ეს არის ერთი პლატფორმა კორპუსის მთელი ცხოვრებისთვის: 
            ხმის მიცემა, სტუმრების საშვი, განცხადებები და ბევრი სხვა.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-500 hover:shadow-primary/40 transition-all active:scale-95 text-lg"
            >
              დაიწყე უფასოდ
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-primary hover:text-primary transition-all active:scale-95 text-lg"
            >
              შესვლა
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.button
            onClick={scrollToFeatures}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex items-center gap-2 text-sm text-slate-400 font-semibold hover:text-primary transition-colors mx-auto lg:mx-0"
          >
            ფუნქციები
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </motion.button>
        </div>

        {/* Right: Building Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col items-center"
        >
          {/* Floating stats */}
          <div className="relative w-full max-w-sm">
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-10 border border-slate-100"
            >
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Vote size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">ბოლო ხმა</div>
                <div className="text-sm font-black text-slate-900">78% — კი</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-10 border border-slate-100"
            >
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                <IdCard size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">საშვი</div>
                <div className="text-sm font-black text-slate-900">3 აქტიური</div>
              </div>
            </motion.div>

            {/* Building */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl shadow-[0_20px_60px_rgba(48,153,251,0.15)] p-8 pt-10">
              <div className="flex justify-center mb-4">
                <Building2 className="text-primary" size={28} />
              </div>
              <BuildingViz />
              <p className="text-center text-xs text-slate-400 font-semibold mt-5">
                კოშკი A · 8 სართული · 40 ბინა
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white/60 backdrop-blur-sm border-y border-white/70 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '500+', label: 'კორპუსი' },
            { value: '12k+', label: 'მაცხოვრებელი' },
            { value: '99%', label: 'კმაყოფილება' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-black text-primary">{s.value}</div>
              <div className="text-slate-500 font-semibold text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 mb-4"
          >
            ყველაფერი ერთ ადგილას
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium max-w-xl mx-auto"
          >
            MyHood შეიცავს ყველა ინსტრუმენტს კორპუსის ეფექტური მართვისთვის
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            delay={0}
            icon={<Vote size={24} />}
            title="ხმის მიცემა და ინიციატივები"
            desc="დაამატეთ ინიციატივები, მიიყვანეთ მეზობლები კენჭისყრამდე და მიაღწიეთ თანხმობას."
          />
          <FeatureCard
            delay={0.08}
            icon={<IdCard size={24} />}
            title="ჭიშკრის კონტროლი"
            desc="გასცეთ სტუმრის ციფრული საშვი QR-კოდით, განსაზღვრეთ ვადა და ტიპი."
          />
          <FeatureCard
            delay={0.16}
            icon={<Users size={24} />}
            title="მაცხოვრებლები"
            desc="ნახეთ კორპუსის მთელი სტრუქტურა — სართული, ბინა, მფლობელი, დამქირავებელი."
          />
          <FeatureCard
            delay={0.24}
            icon={<FileText size={24} />}
            title="დოკუმენტები"
            desc="PDF ღია ხელმისაწვდომი — ოქმები, გადაწყვეტილებები, ბიუჯეტი ერთ სივრცეში."
          />
          <FeatureCard
            delay={0.32}
            icon={<Bell size={24} />}
            title="შეტყობინებები"
            desc="მნიშვნელოვანი მოვლენების შესახებ მყისიერი შეტყობინება პირდაპირ პლატფორმაში."
          />
          <FeatureCard
            delay={0.4}
            icon={<ShieldCheck size={24} />}
            title="უსაფრთხოება"
            desc="JWT-დაფუძნებული ავტორიზაცია, გეგმა — მხოლოდ შენი კორპუსი ხედავს შენს მონაცემებს."
          />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-primary rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-primary/30"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
            მოუწოდე კორპუსს MyHood-ს
          </h2>
          <p className="text-white/75 mb-10 font-medium relative z-10 max-w-md mx-auto">
            დაიწყე ახლავე — უფასოდ, რეგისტრაცია 2 წუთში.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-black rounded-2xl hover:bg-blue-50 transition-all active:scale-95 text-lg shadow-lg"
            >
              რეგისტრაცია
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/25 transition-all active:scale-95 text-lg"
            >
              შესვლა
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400 font-medium">
        © 2025 MyHood · ყველა უფლება დაცულია
      </footer>
    </div>
  );
}
