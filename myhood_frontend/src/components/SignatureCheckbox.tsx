import { useAnimate, motion } from "motion/react";
import { useState } from "react";
import { Pen } from "lucide-react";

interface SignatureCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function SignatureCheckbox({ checked, onChange, label }: SignatureCheckboxProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [scope, animate] = useAnimate();

  const handleClick = async () => {
    if (isAnimating) return;

    if (checked) {
      onChange(false);
      animate(".checkmark-path", { pathLength: 0, opacity: 0 }, { duration: 0.2 });
      animate(".checkbox-box", { borderColor: "#CBD5E1" }, { duration: 0.2 });
      return;
    }

    setIsAnimating(true);

    // 1. Flatten to line and expand container
    animate(".checkbox-container", { width: 160 }, { duration: 0.3, ease: "easeInOut" });
    await animate(".checkbox-box", {
      width: 160,
      height: 2,
      backgroundColor: "#2563EB",
      borderColor: "#2563EB",
      borderWidth: 0,
      borderRadius: 2,
    }, { duration: 0.3, ease: "easeInOut" });

    // 2. Pen appears and signs
    animate(".signature-path", { pathLength: 1, opacity: 1 }, { duration: 1.2, ease: "easeInOut" });
    await animate(".pen-icon", {
      opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      x: [0, 15, 20, 40, 45, 65, 70, 90, 100, 140],
      y: [-6, -22, -2, -26, -4, -22, -4, -26, -2, -16],
      rotate: [0, -15, 10, -20, 15, -15, 10, -20, 15, 0]
    }, { duration: 1.2, ease: "easeInOut" });

    // 3. Shrink back to box
    animate(".signature-path", { opacity: 0 }, { duration: 0.2 });
    animate(".checkbox-container", { width: 24 }, { duration: 0.3, ease: "easeInOut" });
    await animate(".checkbox-box", {
      width: 24,
      height: 24,
      backgroundColor: "transparent",
      borderWidth: 2,
      borderRadius: 6,
      borderColor: "#2563EB",
    }, { duration: 0.3, ease: "easeInOut" });

    // 4. Show checkmark
    onChange(true);
    await animate(".checkmark-path", { pathLength: 1, opacity: 1 }, { duration: 0.3, ease: "easeOut" });

    setIsAnimating(false);
  };

  return (
    <div ref={scope} className="flex items-center h-8 cursor-pointer group" onClick={handleClick}>
       <motion.div
         className="checkbox-container relative h-[24px] flex items-center"
         initial={{ width: 24 }}
       >
         <motion.div
           className="checkbox-box absolute left-0"
           initial={{
             width: 24, height: 24, backgroundColor: "transparent", borderWidth: 2, borderRadius: 6,
             top: "50%", y: "-50%", borderColor: checked ? "#2563EB" : "#CBD5E1"
           }}
         />

         <svg className="absolute left-0 top-[50%] -translate-y-[50%] w-[24px] h-[24px] pointer-events-none" viewBox="0 0 24 24">
           <motion.path
             className="checkmark-path"
             d="M 6 12 L 10 16 L 18 8"
             fill="transparent"
             stroke="#2563EB"
             strokeWidth={2}
             strokeLinecap="round"
             strokeLinejoin="round"
             initial={{ pathLength: 0, opacity: 0 }}
           />
         </svg>

         <svg className="absolute left-[10px] top-[50%] -translate-y-[100%] w-[140px] h-[24px] pointer-events-none overflow-visible" viewBox="0 0 140 24">
           <motion.path
             className="signature-path"
             d="M 0 18 C 10 2, 20 22, 30 10 C 40 -2, 45 20, 55 10 C 65 2, 70 20, 80 10 C 90 -2, 100 22, 110 10 C 120 2, 130 18, 140 8"
             fill="transparent"
             stroke="#2563EB"
             strokeWidth={2}
             strokeLinecap="round"
             strokeLinejoin="round"
             initial={{ pathLength: 0, opacity: 0 }}
           />
         </svg>

         <motion.div
           className="pen-icon absolute origin-bottom-left pointer-events-none"
           style={{ bottom: "50%", left: 10, marginBottom: 0 }}
           initial={{ opacity: 0, x: 0, y: 0 }}
         >
           <Pen size={18} className="text-primary drop-shadow-md" />
         </motion.div>
       </motion.div>

       <span className="ml-3 text-sm text-slate-600 font-medium whitespace-nowrap group-hover:text-primary transition-colors">
         {label}
       </span>
    </div>
  );
}
