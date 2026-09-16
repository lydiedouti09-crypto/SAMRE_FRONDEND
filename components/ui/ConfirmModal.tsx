"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, AlertCircle, HelpCircle, X, Loader2 } from "lucide-react";

export type ConfirmVariant = "danger" | "warning" | "success" | "primary";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const variantConfig = {
    danger: {
      icon: AlertCircle,
      iconBg: "bg-red-50 text-red-600 border-red-100",
      btnBg: "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      btnBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
    },
    success: {
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
    },
    primary: {
      icon: HelpCircle,
      iconBg: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
      btnBg: "bg-brand-orange hover:bg-orange-600 text-white shadow-brand-orange/20",
    },
  };

  const { icon: Icon, iconBg, btnBg } = variantConfig[variant] || variantConfig.primary;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icône de statut */}
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${iconBg} mb-4 shadow-sm`}>
            <Icon size={26} strokeWidth={2.2} />
          </div>

          <h3 className="font-display text-base font-bold text-navy-900 sm:text-lg">
            {title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-sm">
            {message}
          </p>

          {/* Boutons d'action */}
          <div className="mt-6 flex w-full items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold shadow-md transition disabled:opacity-50 ${btnBg}`}
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
