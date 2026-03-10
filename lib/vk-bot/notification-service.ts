// VK Notification Service - отправка уведомлений пользователям ВК

import { vkBotServer } from './server';
import { messageFormatter } from './message-formatter';

export interface BookingNotification {
  vkUserId: number;
  clientName: string;
  service: string;
  master: string;
  date: string;
  time: string;
  type: 'confirmation' | 'reminder_24h' | 'reminder_2h';
}

export class VKNotificationService {
  /**
   * Отправка подтверждения бронирования
   */
  async sendBookingConfirmation(notification: BookingNotification): Promise<void> {
    try {
      const message = this.formatConfirmationMessage(notification);
      await vkBotServer.sendMessage(notification.vkUserId, message.text, message.keyboard);
      
      console.log(`Booking confirmation sent to VK user ${notification.vkUserId}`);
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw error;
    }
  }

  /**
   * Отправка напоминания за 24 часа
   */
  async send24HourReminder(notification: BookingNotification): Promise<void> {
    try {
      const message = this.format24HourReminderMessage(notification);
      await vkBotServer.sendMessage(notification.vkUserId, message.text, message.keyboard);
      
      console.log(`24-hour reminder sent to VK user ${notification.vkUserId}`);
    } catch (error) {
      console.error('Error sending 24-hour reminder:', error);
      throw error;
    }
  }

  /**
   * Отправка напоминания за 2 часа
   */
  async send2HourReminder(notification: BookingNotification): Promise<void> {
    try {
      const message = this.format2HourReminderMessage(notification);
      await vkBotServer.sendMessage(notification.vkUserId, message.text, message.keyboard);
      
      console.log(`2-hour reminder sent to VK user ${notification.vkUserId}`);
    } catch (error) {
      console.error('Error sending 2-hour reminder:', error);
      throw error;
    }
  }

  /**
   * Форматирование сообщения подтверждения
   */
  private formatConfirmationMessage(notification: BookingNotification) {
    const formattedDate = this.formatDate(notification.date);
    
    const text = `✅ **ЗАПИСЬ ПОДТВЕРЖДЕНА!**

🎨 Услуга: ${notification.service}
👤 Мастер: ${notification.master}
📅 Дата: ${formattedDate}
⏰ Время: ${notification.time}
👥 Клиент: ${notification.clientName}

📍 **Адрес студии:**
г. Москва, ул. Примерная, д. 123

📞 **Контакты:**
Телефон: +7 (999) 123-45-67

⚠️ **Важно:**
• Приходите за 5 минут до начала
• При опоздании более чем на 15 минут запись может быть отменена
• Для переноса или отмены записи свяжитесь с нами заранее

Спасибо за выбор нашей студии! 💅✨`;

    return messageFormatter.formatBookingConfirmation({
      service: notification.service,
      master: notification.master,
      date: notification.date,
      time: notification.time,
      clientName: notification.clientName,
      vkProfile: `vk.com/id${notification.vkUserId}`,
      vkUserId: notification.vkUserId
    });
  }

  /**
   * Форматирование напоминания за 24 часа
   */
  private format24HourReminderMessage(notification: BookingNotification) {
    const formattedDate = this.formatDate(notification.date);
    
    const text = `⏰ **НАПОМИНАНИЕ О ЗАПИСИ**

Завтра у вас запись в нашей студии красоты!

🎨 Услуга: ${notification.service}
👤 Мастер: ${notification.master}
📅 Дата: ${formattedDate}
⏰ Время: ${notification.time}

📍 **Адрес:**
г. Москва, ул. Примерная, д. 123

📞 **Контакты:**
Телефон: +7 (999) 123-45-67

⚠️ **Напоминаем:**
• Приходите за 5 минут до начала
• При необходимости переноса или отмены свяжитесь с нами заранее

До встречи завтра! 😊`;

    return {
      text,
      keyboard: {
        one_time: false,
        inline: true,
        buttons: [
          [
            {
              action: {
                type: 'text' as const,
                label: '📞 Связаться',
                payload: JSON.stringify({ command: 'contact' })
              },
              color: 'primary' as const
            }
          ]
        ]
      }
    };
  }

  /**
   * Форматирование напоминания за 2 часа
   */
  private format2HourReminderMessage(notification: BookingNotification) {
    const formattedDate = this.formatDate(notification.date);
    
    const text = `🔔 **СКОРО ВАША ЗАПИСЬ!**

Через 2 часа у вас запись в нашей студии красоты!

🎨 Услуга: ${notification.service}
👤 Мастер: ${notification.master}
📅 Дата: ${formattedDate}
⏰ Время: ${notification.time}

📍 **Адрес:**
г. Москва, ул. Примерная, д. 123

🚗 **Как добраться:**
• Метро "Примерная" (5 минут пешком)
• Парковка рядом с домом

⚠️ **Важно:**
• Приходите за 5 минут до начала
• Возьмите с собой документ, удостоверяющий личность

Ждем вас! 💅✨`;

    return {
      text,
      keyboard: {
        one_time: false,
        inline: true,
        buttons: [
          [
            {
              action: {
                type: 'text' as const,
                label: '📍 Показать на карте',
                payload: JSON.stringify({ command: 'location' })
              },
              color: 'primary' as const
            },
            {
              action: {
                type: 'text' as const,
                label: '📞 Связаться',
                payload: JSON.stringify({ command: 'contact' })
              },
              color: 'secondary' as const
            }
          ]
        ]
      }
    };
  }

  /**
   * Форматирование даты для отображения
   */
  private formatDate(dateStr: string): string {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Получение всех предстоящих бронирований для напоминаний
   */
  async getUpcomingBookingsForReminders(): Promise<BookingNotification[]> {
    try {
      // Получаем все бронирования из API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bookings`);
      const bookings = await response.json();
      
      if (!Array.isArray(bookings)) {
        return [];
      }
      
      const now = new Date();
      const notifications: BookingNotification[] = [];
      
      for (const booking of bookings) {
        // Пропускаем бронирования без VK данных
        if (!booking.vkUserId) {
          continue;
        }
        
        // Парсим дату и время бронирования
        const [year, month, day] = booking.date.split('-').map(Number);
        const [hours, minutes] = booking.time.split(':').map(Number);
        const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
        
        // Пропускаем прошедшие бронирования
        if (bookingDateTime <= now) {
          continue;
        }
        
        const timeDiff = bookingDateTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Определяем тип напоминания
        let type: 'reminder_24h' | 'reminder_2h' | null = null;
        
        if (hoursDiff <= 24 && hoursDiff > 23) {
          type = 'reminder_24h';
        } else if (hoursDiff <= 2 && hoursDiff > 1) {
          type = 'reminder_2h';
        }
        
        if (type) {
          notifications.push({
            vkUserId: booking.vkUserId,
            clientName: booking.clientName,
            service: booking.service,
            master: booking.master,
            date: booking.date,
            time: booking.time,
            type
          });
        }
      }
      
      return notifications;
    } catch (error) {
      console.error('Error getting upcoming bookings:', error);
      return [];
    }
  }

  /**
   * Отправка всех запланированных напоминаний
   */
  async sendScheduledReminders(): Promise<void> {
    try {
      const notifications = await this.getUpcomingBookingsForReminders();
      
      for (const notification of notifications) {
        try {
          if (notification.type === 'reminder_24h') {
            await this.send24HourReminder(notification);
          } else if (notification.type === 'reminder_2h') {
            await this.send2HourReminder(notification);
          }
          
          // Небольшая задержка между отправками
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error sending reminder to user ${notification.vkUserId}:`, error);
          // Продолжаем отправку остальных напоминаний
        }
      }
      
      console.log(`Sent ${notifications.length} scheduled reminders`);
    } catch (error) {
      console.error('Error sending scheduled reminders:', error);
    }
  }
}

// Экспорт singleton instance
export const vkNotificationService = new VKNotificationService();