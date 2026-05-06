"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CheckCircle2, XCircle, Trash2, X } from "lucide-react";

type ToastType = "success" | "error" | "delete";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    delete: (message: string) => void;
  };
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    delete: (message: string) => addToast(message, "delete"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-[12px] border px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 animate-in slide-in-from-top-4 zoom-in-90 fade-in ease-out ${
              t.type === "success"
                ? "border-[#c1e6d1] bg-[#f0fcf5] text-[#2f8c57]"
                : "border-[#f5c4cd] bg-[#fff2f5] text-[#c54564]"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : t.type === "delete" ? (
              <Trash2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p className="text-[12px] font-semibold">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 rounded-full p-1 opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
