import { createContext, useState, useCallback, useEffect } from "react";
import { toastBus } from "../../services/toastBus";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = useCallback((message, type = "error", timeout = 4000) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    if (timeout) {
      setTimeout(() => removeToast(id), timeout);
    }
  }, []);

  useEffect(() => {
    toastBus.bind(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Render global */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)}>✖</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
