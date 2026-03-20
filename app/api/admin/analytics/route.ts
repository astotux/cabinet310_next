import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const masterFilter = searchParams.get("master"); // null = all

    const [allBookings, services] = await Promise.all([
      prisma.booking.findMany({ orderBy: { date: "asc" } }),
      prisma.price.findMany(),
    ]);

    // Apply master filter
    const bookings = masterFilter
      ? allBookings.filter((b) => b.master === masterFilter)
      : allBookings;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const parseDate = (d: string) => {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y, m - 1, day);
    };

    const getPrice = (b: (typeof bookings)[0]) => {
      if (b.customPrice) return b.customPrice;
      const svc = services.find((s) => s.service === b.service && s.master === b.master);
      return svc?.price || 0;
    };

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

    const revenueThisMonth = thisMonthBookings.reduce((s, b) => s + getPrice(b), 0);
    const revenueLastMonth = lastMonthBookings.reduce((s, b) => s + getPrice(b), 0);
    const revenueThisYear = thisYearBookings.reduce((s, b) => s + getPrice(b), 0);

    const revenueByMaster: Record<string, number> = {};
    const bookingsByMaster: Record<string, number> = {};
    // Always compute by master from unfiltered this-month data
    allBookings
      .filter((b) => {
        const d = parseDate(b.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .forEach((b) => {
        revenueByMaster[b.master] = (revenueByMaster[b.master] || 0) +
          (b.customPrice || services.find((s) => s.service === b.service && s.master === b.master)?.price || 0);
        bookingsByMaster[b.master] = (bookingsByMaster[b.master] || 0) + 1;
      });

    const totalBookings = bookings.length;
    const bookingsThisMonth = thisMonthBookings.length;
    const bookingsLastMonth = lastMonthBookings.length;

    const todayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const todayBookings = bookings.filter((b) => b.date === todayStr).length;

    const phoneCounts: Record<string, number> = {};
    allBookings.forEach((b) => {
      if (b.clientPhone) phoneCounts[b.clientPhone] = (phoneCounts[b.clientPhone] || 0) + 1;
    });
    const uniqueClients = Object.keys(phoneCounts).length;
    const newClients = Object.values(phoneCounts).filter((c) => c === 1).length;

    const serviceCounts: Record<string, number> = {};
    thisYearBookings.forEach((b) => {
      serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

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

    const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const byDayOfWeek = Array(7).fill(0);
    thisYearBookings.forEach((b) => {
      byDayOfWeek[parseDate(b.date).getDay()]++;
    });
    const bookingsByDay = dayNames.map((name, i) => ({ name, count: byDayOfWeek[i] }));

    const weeksInMonth = Math.ceil(new Date(currentYear, currentMonth + 1, 0).getDate() / 7);
    const avgPerWeek = Math.round(bookingsThisMonth / weeksInMonth);

    // Get unique masters list
    const masters = [...new Set(allBookings.map((b) => b.master))].sort();

    return NextResponse.json({
      overview: {
        totalBookings, bookingsThisMonth, bookingsLastMonth,
        todayBookings, revenueThisMonth, revenueLastMonth,
        revenueThisYear, avgPerWeek,
      },
      clients: { uniqueClients, newClients },
      topServices,
      monthlyRevenue,
      bookingsByDay,
      revenueByMaster,
      bookingsByMaster,
      masters,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
