"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MoreVertical, 
  Eye, 
  Edit2, 
  CheckCircle, 
  XCircle, 
  Trash2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface ActionMenuProps {
  onView?: () => void;
  onDelete?: () => void;
}

export default function ActionMenu({
  onView,
  onDelete
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("superAdmin.applications.actions");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { 
      label: t("view"), 
      icon: Eye, 
      onClick: onView, 
      color: "text-slate-200 hover:text-white" 
    },
    { 
      label: t("delete"), 
      icon: Trash2, 
      onClick: onDelete, 
      color: "text-rose-400 hover:text-rose-300" 
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
        title={t("title")}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 bg-[#1A3B66] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm"
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${action.color}`}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
