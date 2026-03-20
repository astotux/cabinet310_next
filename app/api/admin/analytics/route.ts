import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [bookings, services] = await Promise.all([
      prisma.booking.findMany({ orderBy: { date: "asc" } }),
      prisma.price.findMany(),
    ]);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Helper: parse "YYYY-MM-DD" to Date
    const parseDate = (d: string) => {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y, m - 1, day);
    };

    const getPrice = (b: (typeof bookings)[0]) => {
      if (b.customPrice) return b.customPrice;
      const svc = services.find((s) => s.service === b.service && s.master === b.master);
      return svc?.price || 0;
    };

    // --- Period filters ---
    const thisMonthBookings = bookings.filter((b) => {
      const d = parseDate(b.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const lastMonthBookings = bookings.filter((b) => {
      const d = parseDate(b.date);
      const lm = currentMonth === 0 ? 11 : currentMonth - 1;
      const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
      return d.getFullYear() === ly && d.getMonth() === lm;
    });

    const thisYearBookings = bookings.filter((b) => {
      return parseDate(b.date).getFullYear() === currentYear;
    });

    // --- Revenue ---
    const revenueThisMonth = thisMonthBookings.reduce((s, b) => s + getPrice(b), 0);
    const revenueLastMonth = lastMonthBookings.reduce((s, b) => s + getPrice(b), 0);
    const revenueThisYear = thisYearBookings.reduce((s, b) => s + getPrice(b), 0);

    // --- Revenue by master this month ---
    const revenueByMaster: Record<string, number> = {};
    thisMonthBookings.forEach((b) => {
      revenueByMaster[b.master] = (revenueByMaster[b.master] || 0) + getPrice(b);
    });

    // --- Bookings count ---
    const totalBookings = bookings.length;
    const bookingsThisMonth = thisMonthBookings.length;
    const bookingsLastMonth = lastMonthBookings.length;

    // --- Today ---
    const todayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const todayBookings = bookings.filter((b) => b.date === todayStr).length;

    // --- Repeat clients (phone appears more than once) ---
    const phoneCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      if (b.clientPhone) phoneCounts[b.clientPhone] = (phoneCounts[b.clientPhone] || 0) + 1;
    });
    const uniqueClients = Object.keys(phoneCounts).length;
    const newClients = Object.values(phoneCounts).filter((c) => c === 1).length;

    // --- Top services this year ---
    const serviceCounts: Record<string, number> = {};
    thisYearBookings.forEach((b) => {
      serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // --- Monthly revenue for last 6 months ---
    const monthlyRevenue: { month: string; revenue: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const mb = bookings.filter((b) => {
        const bd = parseDate(b.date);
        return bd.getFullYear() === y && bd.getMonth() === m;
      });
      monthlyRevenue.push({
        month: d.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" }),
        revenue: mb.reduce((s, b) => s + getPrice(b), 0),
        count: mb.length,
      });
    }

    // --- Bookings by day of week (this year) ---
    const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const byDayOfWeek = Array(7).fill(0);
    thisYearBookings.forEach((b) => {
      const dow = parseDate(b.date).getDay();
      byDayOfWeek[dow]++;
    });
    const bookingsByDay = dayNames.map((name, i) => ({ name, count: byDayOfWeek[i] }));

    // --- Avg bookings per week this month ---
    const weeksInMonth = Math.ceil(new Date(currentYear, currentMonth + 1, 0).getDate() / 7);
    const avgPerWeek = Math.round(bookingsThisMonth / weeksInMonth);

    // --- Bookings by master this month ---
    const bookingsByMaster: Record<string, number> = {};
    thisMonthBookings.forEach((b) => {
      bookingsByMaster[b.master] = (bookingsByMaster[b.master] || 0) + 1;
    });

    return NextResponse.json({
      overview: {
        totalBookings,
        bookingsThisMonth,
        bookingsLastMonth,
        todayBookings,
        revenueThisMonth,
        revenueLastMonth,
        revenueThisYear,
        avgPerWeek,
      },
      clients: {
        uniqueClients,
        newClients,
      },
      topServices,
      monthlyRevenue,
      bookingsByDay,
      revenueByMaster,
      bookingsByMaster,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
