import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Booking {
  id: number;
  service: string;
  master: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  comment?: string;
}

export async function exportBookingsToPDF(bookings: Booking[], month: number, year: number) {
  const doc = new jsPDF() as any;

  // Названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  // Фильтруем и сортируем записи
  const monthBookings = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

  if (monthBookings.length === 0) {
    throw new Error('Нет записей за текущий месяц');
  }

  // Заголовок (транслитерация)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = `Zapisi za ${transliterate(monthNames[month])} ${year}`;
  doc.text(title, 105, 15, { align: 'center' });

  // Подзаголовок
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Vsego zapisej: ${monthBookings.length}`, 105, 22, { align: 'center' });

  // Информация о студии
  doc.setFontSize(9);
  doc.text('Kabinet 310 - Studiya estetiki', 105, 27, { align: 'center' });

  // Подготавливаем данные для таблицы
  const tableData = monthBookings.map(booking => {
    const date = new Date(booking.date);
    const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

    return [
      formattedDate,
      booking.time,
      transliterate(booking.service),
      transliterate(booking.master),
      transliterate(booking.clientName),
      booking.clientPhone,
      booking.comment ? transliterate(booking.comment.substring(0, 50)) : '-'
    ];
  });

  // Создаем таблицу
  doc.autoTable({
    startY: 35,
    head: [['Data', 'Vremya', 'Usluga', 'Master', 'Klient', 'Telefon', 'Kommentarij']],
    body: tableData,
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [147, 51, 234],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 38 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 32 },
      5: { cellWidth: 28 },
      6: { cellWidth: 29, fontSize: 7 },
    },
    margin: { left: 10, right: 10 },
  });

  // Футер с номерами страниц
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Stranica ${i} iz ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    
    // Дата создания отчета
    const now = new Date();
    const reportDate = now.toLocaleDateString('ru-RU');
    doc.text(
      `Sozdano: ${reportDate}`,
      15,
      doc.internal.pageSize.height - 10
    );
  }

  // Сохраняем файл
  const fileName = `zapisi_${transliterate(monthNames[month])}_${year}.pdf`;
  doc.save(fileName);
}

// Функция транслитерации кириллицы в латиницу
function transliterate(text: string): string {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
    'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };

  return text.split('').map(char => map[char] || char).join('');
}
