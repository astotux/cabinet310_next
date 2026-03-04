"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Важно для cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токен в localStorage как запасной вариант
        localStorage.setItem("adminToken", data.token);
        
        console.log('[Login] Success, redirecting to /admin');
        
        // Используем window.location для гарантированного редиректа
        // Это обеспечит полную перезагрузку страницы и применение middleware
        window.location.href = "/admin";
      } else {
        setError(data.error || "Неверные данные");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ошибка подключения");
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen overflow-x-hidden flex items-center justify-center p-6 max-[480px]:p-4 max-[320px]:p-3">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 size-96 gradient-bg opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 size-96 bg-primary/20 opacity-20 blur-3xl rounded-full"></div>
        <img src="/star.svg" alt="" className="absolute left-[10%] top-[15%] w-12 h-12 opacity-15" />
        <img src="/star.svg" alt="" className="absolute right-[15%] top-[20%] w-14 h-14 opacity-15" />
        <img src="/star.svg" alt="" className="absolute left-[20%] bottom-[25%] w-10 h-10 opacity-12" />
        <img src="/star.svg" alt="" className="absolute right-[10%] bottom-[15%] w-12 h-12 opacity-12" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo.svg" style={{ width: '120px' }} alt="Cabinet 310" className="mx-auto" />
          </Link>
          <h1 className="text-3xl max-[480px]:text-2xl max-[320px]:text-xl font-black tracking-tight mb-2">
            Вход для мастеров
          </h1>
          <p className="text-slate-500 text-sm">
            Введите данные для доступа к админ-панели
          </p>
        </div>

        <div className="glass rounded-3xl p-8 max-[480px]:p-6 max-[320px]:p-5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block">
                Логин или Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  person
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Введите логин"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block">
                Пароль
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Введите пароль"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти в панель"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Вернуться на главную
          </Link>
        </div>

        <div className="mt-8 glass rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm text-primary">shield</span>
            <span>Защищенное соединение • Данные зашифрованы</span>
          </div>
        </div>
      </div>
    </div>
  );
}
