"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { SERVICES, TIME_SLOTS } from "@/lib/constants";
import type { AvailabilityResponse } from "@/types";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleServiceSelect = (serviceId: string) => {
    setService(serviceId);
    setStep(2);
  };

  const handleTimeSelect = async (selectedTime: string) => {
    if (!date) {
      alert("Выберите дату");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, date, time: selectedTime }),
    });

    const data: AvailabilityResponse = await response.json();
    setLoading(false);

    if (data.available) {
      setTime(selectedTime);
      setStep(3);
    } else {
      alert(data.reason || "Время недоступно");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedService = SERVICES.find(s => s.id === service);
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          master: selectedService?.master,
          date,
          time,
          clientName: name,
          clientPhone: phone,
        }),
      });

      if (response.ok) {
        alert("✅ Запись успешно создана! Мы свяжемся с вами для подтверждения.");
        window.location.href = "/";
      } else {
        alert("❌ Ошибка при создании записи. Попробуйте еще раз.");
      }
    } catch (error) {
      alert("❌ Ошибка подключения. Проверьте интернет и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full mx-1 ${
                    s <= step ? "bg-primary" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <h2 className="text-3xl font-black">
              {step === 1 && "Выберите услугу"}
              {step === 2 && "Выберите дату и время"}
              {step === 3 && "Ваши данные"}
            </h2>
          </div>

          {step === 1 && (
            <div className="grid gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleServiceSelect(s.id)}
                  className="glass p-6 rounded-2xl text-left hover:bg-white/80 transition-all"
                >
                  <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                  <p className="text-sm text-slate-600">{s.master}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Дата</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Время</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTimeSelect(t)}
                      disabled={loading || !date}
                      className="p-3 rounded-xl glass hover:bg-white/80 transition-all disabled:opacity-50"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-primary font-bold"
              >
                ← Назад
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-primary font-bold"
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-bg px-8 py-3 rounded-xl text-white font-bold flex-1"
                >
                  {loading ? "Загрузка..." : "Записаться"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
