// Message Formatter - форматирование сообщений для ВКонтакте

import { ServiceInfo, FormattedMessage, VKKeyboard, VKBookingData } from './types';

export class MessageFormatter {
  /**
   * Форматирование прайс-листа
   */
  formatPriceList(services: ServiceInfo[]): FormattedMessage {
    if (services.length === 0) {
      return {
        text: '❌ Услуги не найдены. Попробуйте позже.',
      };
    }

    // Группируем услуги по категориям
    const servicesByCategory = this.groupServicesByCategory(services);
    
    let text = '💅 ПРАЙС-ЛИСТ\n\n';
    
    for (const [category, categoryServices] of Object.entries(servicesByCategory)) {
      text += `🔸 ${category.toUpperCase()}\n`;
      
      categoryServices.forEach(service => {
        const duration = this.formatDuration(service.duration);
        text += `• ${service.service}\n`;
        if (service.description) {
          text += `  ${service.description}\n`;
        }
        text += `  ⏱ Время: ${duration}\n`;
        text += `  💰 Цена: ${service.price} ₽\n\n`;
      });
    }

    text += '📞 Для записи нажмите "Записаться" или напишите "Записаться"';

    // Создаем клавиатуру
    const keyboard: VKKeyboard = {
      one_time: false,
      inline: true,
      buttons: [
        [
          {
            action: {
              type: 'text',
              label: '✍️ Записаться',
              payload: JSON.stringify({ command: 'book' })
            },
            color: 'positive'
          }
        ],
        [
          {
            action: {
              type: 'text',
              label: '👤 Связаться с человеком',
              payload: JSON.stringify({ command: 'contact_human' })
            },
            color: 'secondary'
          }
        ]
      ]
    };

    return { text, keyboard };
  }

  /**
   * Форматирование доступных слотов
   */
  formatAvailableSlots(slots: string[], date: string, serviceName?: string): FormattedMessage {
    if (slots.length === 0) {
      return {
        text: `❌ На ${this.formatDate(date)} нет свободных слотов.\n\nПопробуйте выбрать другую дату.`,
        keyboard: this.createBackKeyboard()
      };
    }

    let text = `📅 СВОБОДНЫЕ СЛОТЫ\n\n`;
    if (serviceName) {
      text += `🎨 Услуга: ${serviceName}\n`;
    }
    text += `📆 Дата: ${this.formatDate(date)}\n\n`;

    text += '⏰ Доступное время:\n';
    
    const buttons: any[][] = [];
    
    // Группируем слоты по времени дня
    const morningSlots = slots.filter(slot => this.isMorning(slot));
    const afternoonSlots = slots.filter(slot => this.isAfternoon(slot));
    const eveningSlots = slots.filter(slot => this.isEvening(slot));

    // Добавляем кнопки по 2 в ряд для экономии места
    const addSlotsToButtons = (timeSlots: string[], emoji: string) => {
      for (let i = 0; i < timeSlots.length; i += 2) {
        const row = [];
        
        // Первая кнопка в ряду
        row.push({
          action: {
            type: 'text',
            label: `${emoji} ${timeSlots[i]}`,
            payload: JSON.stringify({ command: 'select_time', time: timeSlots[i] })
          },
          color: 'primary'
        });
        
        // Вторая кнопка в ряду (если есть)
        if (i + 1 < timeSlots.length) {
          row.push({
            action: {
              type: 'text',
              label: `${emoji} ${timeSlots[i + 1]}`,
              payload: JSON.stringify({ command: 'select_time', time: timeSlots[i + 1] })
            },
            color: 'primary'
          });
        }
        
        buttons.push(row);
      }
    };

    if (morningSlots.length > 0) {
      text += `🌅 Утро: ${morningSlots.join(', ')}\n`;
      addSlotsToButtons(morningSlots, '🌅');
    }
    
    if (afternoonSlots.length > 0) {
      text += `☀️ День: ${afternoonSlots.join(', ')}\n`;
      addSlotsToButtons(afternoonSlots, '☀️');
    }
    
    if (eveningSlots.length > 0) {
      text += `🌆 Вечер: ${eveningSlots.join(', ')}\n`;
      addSlotsToButtons(eveningSlots, '🌆');
    }

    // Ограничиваем количество кнопок до 8 рядов (VK лимит 10, оставляем место для навигации)
    const maxRows = 8;
    if (buttons.length > maxRows) {
      buttons.splice(maxRows);
      text += '\n⚠️ Показаны не все слоты. Выберите из доступных или попробуйте другую дату.';
    }

    // Добавляем кнопку "Назад"
    buttons.push([{
      action: {
        type: 'text',
        label: '⬅️ Назад к датам',
        payload: JSON.stringify({ command: 'back_to_date' })
      },
      color: 'secondary'
    }]);

    const keyboard: VKKeyboard = {
      one_time: false,
      inline: true,
      buttons: buttons
    };

    return { text, keyboard };
  }

  /**
   * Форматирование подтверждения бронирования
   */
  formatBookingConfirmation(booking: VKBookingData): FormattedMessage {
    const text = `✅ ЗАПИСЬ ПОДТВЕРЖДЕНА!

🎨 Услуга: ${booking.service}
📅 Дата: ${this.formatDate(booking.date)}
⏰ Время: ${booking.time}
👥 Клиент: ${booking.clientName}

📍 Адрес студии:
г. Москва, ул. Примерная, д. 123

📞 Контакты:
Телефон: +7 (999) 123-45-67

⚠️ Важно:
• Приходите за 5 минут до начала
• При опоздании более чем на 15 минут запись может быть отменена
• Для переноса или отмены записи свяжитесь с нами заранее

Спасибо за выбор нашей студии! 💅✨`;

    const keyboard: VKKeyboard = {
      one_time: false,
      inline: true,
      buttons: [
        [
          {
            action: {
              type: 'text',
              label: '📋 Прайс-лист',
              payload: JSON.stringify({ command: 'price' })
            },
            color: 'secondary'
          },
          {
            action: {
              type: 'text',
              label: '✍️ Еще запись',
              payload: JSON.stringify({ command: 'book' })
            },
            color: 'positive'
          }
        ]
      ]
    };

    return { text, keyboard };
  }

  /**
   * Форматирование сообщения об ошибке
   */
  formatError(error: string): FormattedMessage {
    const text = `❌ ОШИБКА\n\n${error}\n\nПопробуйте еще раз или обратитесь к администратору.`;
    
    return { 
      text,
      keyboard: this.createMainMenuKeyboard()
    };
  }

  /**
   * Форматирование справочного сообщения
   */
  formatHelp(): FormattedMessage {
    const text = `❓ СПРАВКА

Я помогу вам записаться на услуги нашей студии красоты!

🔹 Доступные команды:
• 📋 Прайс - посмотреть услуги и цены
• ✍️ Записаться - записаться на услугу
• 👤 Связаться с человеком - получить помощь от администратора
• ❌ Отмена - отменить текущее действие

🔹 Как записаться:
1. Нажмите "Записаться" или напишите "Записаться"
2. Выберите услугу из списка
3. Выберите удобную дату и время
4. Укажите ваше имя
5. Подтвердите запись

📞 Контакты:
Телефон: +7 (999) 123-45-67
Адрес: г. Москва, ул. Примерная, д. 123

Если у вас есть вопросы, обращайтесь к администратору! 😊`;

    return { 
      text,
      keyboard: this.createMainMenuKeyboard()
    };
  }

  /**
   * Форматирование приветственного сообщения
   */
  formatWelcome(): FormattedMessage {
    const text = `👋 Добро пожаловать в студию красоты!

Я ваш помощник для записи на услуги. Здесь вы можете:

🔸 Посмотреть прайс-лист
🔸 Записаться на любую услугу
🔸 Получить информацию о студии

Выберите действие или напишите команду:`;

    return { 
      text,
      keyboard: this.createMainMenuKeyboard()
    };
  }

  /**
   * Форматирование списка услуг для выбора
   */
  formatServiceSelection(services: ServiceInfo[]): FormattedMessage {
    const servicesByCategory = this.groupServicesByCategory(services);
    
    let text = '🎨 ВЫБЕРИТЕ УСЛУГУ\n\n';
    
    const buttons: any[][] = [];
    
    for (const [category, categoryServices] of Object.entries(servicesByCategory)) {
      text += `🔸 ${category.toUpperCase()}\n`;
      
      categoryServices.forEach(service => {
        text += `• ${service.service} - ${service.price} ₽\n`;
        
        // Добавляем кнопку для каждой услуги
        buttons.push([{
          action: {
            type: 'text',
            label: service.service,
            payload: JSON.stringify({ 
              command: 'select_service', 
              service: service.service 
            })
          },
          color: 'primary'
        }]);
      });
      
      text += '\n';
    }

    // Добавляем кнопку "Назад"
    buttons.push([{
      action: {
        type: 'text',
        label: '⬅️ Назад',
        payload: JSON.stringify({ command: 'cancel' })
      },
      color: 'secondary'
    }]);

    const keyboard: VKKeyboard = {
      one_time: false,
      inline: true,
      buttons: buttons.slice(0, 10) // Ограничиваем количество кнопок
    };

    return { text, keyboard };
  }

  /**
   * Форматирование выбора даты с кнопками-слайдером
   */
  formatDateSelection(availableDates: string[], serviceName: string, currentIndex: number = 0): FormattedMessage {
    if (availableDates.length === 0) {
      return {
        text: '❌ Нет доступных дат для записи.',
        keyboard: this.createBackKeyboard()
      };
    }

    const maxDatesPerPage = 3; // Уменьшаем до 3 дат на страницу
    const startIndex = currentIndex;
    const endIndex = Math.min(startIndex + maxDatesPerPage, availableDates.length);
    const currentDates = availableDates.slice(startIndex, endIndex);

    let text = `🎨 Услуга: ${serviceName}\n\n📅 ВЫБЕРИТЕ ДАТУ\n\n`;
    
    const buttons: any[][] = [];
    
    // Добавляем кнопки для дат
    currentDates.forEach(date => {
      const displayDate = this.formatDate(date);
      buttons.push([{
        action: {
          type: 'text',
          label: displayDate,
          payload: JSON.stringify({ 
            command: 'select_date', 
            date: date 
          })
        },
        color: 'primary'
      }]);
      text += `📆 ${displayDate}\n`;
    });

    // Добавляем навигационные кнопки в одну строку
    const navButtons = [];
    if (startIndex > 0) {
      navButtons.push({
        action: {
          type: 'text',
          label: '⬅️ Пред.',
          payload: JSON.stringify({ 
            command: 'prev_dates', 
            index: Math.max(0, startIndex - maxDatesPerPage)
          })
        },
        color: 'secondary'
      });
    }
    
    if (endIndex < availableDates.length) {
      navButtons.push({
        action: {
          type: 'text',
          label: 'След. ➡️',
          payload: JSON.stringify({ 
            command: 'next_dates', 
            index: endIndex
          })
        },
        color: 'secondary'
      });
    }
    
    if (navButtons.length > 0) {
      buttons.push(navButtons);
    }

    // Добавляем кнопку "Назад"
    buttons.push([{
      action: {
        type: 'text',
        label: '⬅️ Назад к услугам',
        payload: JSON.stringify({ command: 'back_to_services' })
      },
      color: 'secondary'
    }]);

    const keyboard: VKKeyboard = {
      one_time: false,
      inline: true,
      buttons: buttons
    };

    return { text, keyboard };
  }

  /**
   * Группировка услуг по категориям
   */
  private groupServicesByCategory(services: ServiceInfo[]): Record<string, ServiceInfo[]> {
    return services.reduce((acc, service) => {
      const category = service.category || 'Другое';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, ServiceInfo[]>);
  }

  /**
   * Форматирование длительности
   */
  private formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ч`;
    }
    
    return `${hours} ч ${remainingMinutes} мин`;
  }

  /**
   * Форматирование даты
   */
  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
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
   * Проверка утреннего времени
   */
  private isMorning(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 9 && hour < 12;
  }

  /**
   * Проверка дневного времени
   */
  private isAfternoon(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 12 && hour < 17;
  }

  /**
   * Проверка вечернего времени
   */
  private isEvening(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 17 && hour <= 20;
  }

  /**
   * Создание основной клавиатуры
   */
  private createMainMenuKeyboard(): VKKeyboard {
    return {
      one_time: false,
      inline: true,
      buttons: [
        [
          {
            action: {
              type: 'text',
              label: '📋 Прайс-лист',
              payload: JSON.stringify({ command: 'price' })
            },
            color: 'primary'
          },
          {
            action: {
              type: 'text',
              label: '✍️ Записаться',
              payload: JSON.stringify({ command: 'book' })
            },
            color: 'positive'
          }
        ],
        [
          {
            action: {
              type: 'text',
              label: '👤 Связаться с человеком',
              payload: JSON.stringify({ command: 'contact_human' })
            },
            color: 'secondary'
          }
        ]
      ]
    };
  }

  /**
   * Создание клавиатуры "Назад"
   */
  private createBackKeyboard(): VKKeyboard {
    return {
      one_time: false,
      inline: true,
      buttons: [
        [
          {
            action: {
              type: 'text',
              label: '⬅️ Назад',
              payload: JSON.stringify({ command: 'cancel' })
            },
            color: 'secondary'
          },
          {
            action: {
              type: 'text',
              label: '🏠 Главное меню',
              payload: JSON.stringify({ command: 'start' })
            },
            color: 'primary'
          }
        ]
      ]
    };
  }

  /**
   * Форматирование сообщения о запросе связи с человеком
   */
  formatContactHumanRequest(): FormattedMessage {
    const text = `👤 Запрос отправлен!

Ваш запрос на связь с администратором отправлен. 
Мы свяжемся с вами в ближайшее время.

А пока вы можете:`;

    return {
      text,
      keyboard: this.createMainMenuKeyboard()
    };
  }
}

// Экспорт singleton instance
export const messageFormatter = new MessageFormatter();