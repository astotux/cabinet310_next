// Утилита для отправки уведомлений в VK

const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN;
const VK_GROUP_ID = process.env.VK_GROUP_ID;
const VK_ADMIN_IDS = process.env.VK_ADMIN_IDS?.split(',') || [];

interface BookingNotification {
  service: string;
  master: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  comment?: string;
}

interface ReviewNotification {
  name: string;
  rating: number;
  text: string;
  service?: string;
}

async function sendVKMessage(userId: string, message: string) {
  if (!VK_ACCESS_TOKEN || !VK_GROUP_ID) {
    console.warn('VK credentials not configured');
    return;
  }

  try {
    const response = await fetch('https://api.vk.com/method/messages.send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: VK_ACCESS_TOKEN,
        v: '5.131',
        user_id: userId,
        message: message,
        random_id: String(Date.now()),
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('VK API error:', data.error);
    }
  } catch (error) {
    console.error('Failed to send VK notification:', error);
  }
}

export async function notifyNewBooking(booking: BookingNotification) {
  const message = `🎉 Новая запись!

📋 Услуга: ${booking.service}
👤 Мастер: ${booking.master}
📅 Дата: ${booking.date}
⏰ Время: ${booking.time}

👥 Клиент: ${booking.clientName}
📱 Телефон: ${booking.clientPhone}
${booking.comment ? `💬 Комментарий: ${booking.comment}` : ''}`;

  // Отправляем уведомление всем админам
  for (const adminId of VK_ADMIN_IDS) {
    await sendVKMessage(adminId, message);
  }
}

export async function notifyNewReview(review: ReviewNotification) {
  const stars = '⭐'.repeat(review.rating);
  
  const message = `📝 Новый отзыв на модерации!

👤 Имя: ${review.name}
${stars} (${review.rating}/5)
${review.service ? `🎨 Услуга: ${review.service}` : ''}

💬 Текст:
${review.text}`;

  // Отправляем уведомление всем админам
  for (const adminId of VK_ADMIN_IDS) {
    await sendVKMessage(adminId, message);
  }
}
