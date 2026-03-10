// Command Handlers - обработчики команд VK бота

import { VKMessage, DialogState, CommandType } from './types';
import { messageFormatter } from './message-formatter';
import { vkBookingService } from './booking-service';
import { stateManager } from './state-manager';
import { vkBotServer } from './server';
import { vkNotificationService } from './notification-service';

export class CommandHandlers {
  /**
   * Обработчик команды "Начать"
   */
  async handleStartCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      // Очищаем состояние пользователя
      await stateManager.clearUserState(userId);
      
      // Устанавливаем состояние IDLE
      await stateManager.transitionTo(userId, DialogState.IDLE);
      
      // Отправляем приветственное сообщение
      const welcomeMessage = messageFormatter.formatWelcome();
      await vkBotServer.sendMessage(userId, welcomeMessage.text, welcomeMessage.keyboard);
      
      console.log(`Start command handled for user ${userId}`);
    } catch (error) {
      console.error('Error handling start command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка инициализации. Попробуйте еще раз.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработчик команды "Прайс"
   */
  async handlePriceCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      // Получаем список услуг
      const services = await vkBookingService.getAvailableServices();
      
      if (services.length === 0) {
        const errorMessage = messageFormatter.formatError('Услуги временно недоступны. Попробуйте позже.');
        await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
        return;
      }
      
      // Форматируем и отправляем прайс-лист
      const priceMessage = messageFormatter.formatPriceList(services);
      await vkBotServer.sendMessage(userId, priceMessage.text, priceMessage.keyboard);
      
      console.log(`Price command handled for user ${userId}`);
    } catch (error) {
      console.error('Error handling price command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка получения прайс-листа. Попробуйте еще раз.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработчик команды "Записаться"
   */
  async handleBookCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      // Переводим пользователя в состояние выбора услуги
      await stateManager.transitionTo(userId, DialogState.SELECTING_SERVICE);
      
      // Получаем список услуг
      const services = await vkBookingService.getAvailableServices();
      
      if (services.length === 0) {
        const errorMessage = messageFormatter.formatError('Услуги временно недоступны. Попробуйте позже.');
        await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
        return;
      }
      
      // Отправляем список услуг для выбора
      const serviceMessage = messageFormatter.formatServiceSelection(services);
      await vkBotServer.sendMessage(userId, serviceMessage.text, serviceMessage.keyboard);
      
      console.log(`Book command handled for user ${userId}`);
    } catch (error) {
      console.error('Error handling book command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка начала записи. Попробуйте еще раз.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработчик команды "Помощь" - теперь обрабатывает запрос связи с человеком
   */
  async handleContactHumanCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      // Получаем информацию о пользователе для уведомления админов
      const currentState = await stateManager.getUserState(userId);
      const userName = currentState.bookingData.clientName;
      
      // Уведомляем админов
      await vkNotificationService.notifyAdminsAboutContactRequest(userId, userName);
      
      // Отправляем подтверждение пользователю
      const contactMessage = messageFormatter.formatContactHumanRequest();
      await vkBotServer.sendMessage(userId, contactMessage.text, contactMessage.keyboard);
      
      console.log(`Contact human request handled for user ${userId}`);
    } catch (error) {
      console.error('Error handling contact human request:', error);
      const errorMessage = messageFormatter.formatError('Ошибка отправки запроса. Попробуйте еще раз.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработчик команды "Отмена"
   */
  async handleCancelCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      const currentState = await stateManager.getUserState(userId);
      
      // Если пользователь в процессе бронирования, возвращаем к главному меню
      if (currentState.currentState !== DialogState.IDLE) {
        await stateManager.transitionTo(userId, DialogState.IDLE);
        
        const cancelMessage = '❌ Действие отменено. Возвращаемся к главному меню.';
        const welcomeMessage = messageFormatter.formatWelcome();
        
        await vkBotServer.sendMessage(userId, cancelMessage);
        await vkBotServer.sendMessage(userId, welcomeMessage.text, welcomeMessage.keyboard);
      } else {
        // Если уже в главном меню, просто показываем меню
        const welcomeMessage = messageFormatter.formatWelcome();
        await vkBotServer.sendMessage(userId, welcomeMessage.text, welcomeMessage.keyboard);
      }
      
      console.log(`Cancel command handled for user ${userId}`);
    } catch (error) {
      console.error('Error handling cancel command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка отмены действия.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработчик неизвестной команды
   */
  async handleUnknownCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      // Проверяем payload для кнопочных команд
      if (message.payload) {
        try {
          const payload = JSON.parse(message.payload);
          await this.handlePayloadCommand(message, payload);
          return;
        } catch (error) {
          console.error('Error parsing payload:', error);
        }
      }
      
      // Проверяем текстовые команды
      const text = message.text.toLowerCase().trim();
      if (text === 'связаться с человеком' || text === 'человек' || text === 'помощь') {
        await this.handleContactHumanCommand(message);
        return;
      }
      
      const currentState = await stateManager.getUserState(userId);
      
      // Если пользователь в процессе бронирования, обрабатываем как ввод данных
      if (currentState.currentState !== DialogState.IDLE) {
        await this.handleStateInput(message, currentState.currentState);
        return;
      }
      
      // Иначе показываем сообщение о неизвестной команде
      let text_msg = `❓ Не понимаю команду "${message.text}"\n\n`;
      text_msg += 'Доступные команды:\n';
      text_msg += '• 📋 Прайс - посмотреть услуги и цены\n';
      text_msg += '• ✍️ Записаться - записаться на услугу\n';
      text_msg += '• 👤 Связаться с человеком - получить помощь\n\n';
      text_msg += 'Или выберите действие из меню:';
      
      const welcomeMessage = messageFormatter.formatWelcome();
      await vkBotServer.sendMessage(userId, text_msg, welcomeMessage.keyboard);
      
      console.log(`Unknown command handled for user ${userId}: ${message.text}`);
    } catch (error) {
      console.error('Error handling unknown command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка обработки команды.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработка команд из payload (кнопки)
   */
  private async handlePayloadCommand(message: VKMessage, payload: any): Promise<void> {
    const userId = message.from_id;
    
    switch (payload.command) {
      case 'contact_human':
        await this.handleContactHumanCommand(message);
        break;
        
      case 'select_service':
        await this.handleServiceSelection(userId, payload.service);
        break;
        
      case 'select_date':
        await this.handleDateSelection(userId, payload.date);
        break;
        
      case 'select_time':
        await this.handleTimeSelection(userId, payload.time);
        break;
        
      case 'back_to_services':
        await this.handleBookCommand(message);
        break;
        
      case 'back_to_date':
        const currentState = await stateManager.getUserState(userId);
        if (currentState.bookingData.service) {
          await stateManager.transitionTo(userId, DialogState.SELECTING_DATE);
          const availableDates = await vkBookingService.getAvailableDates(currentState.bookingData.service);
          const dateMessage = messageFormatter.formatDateSelection(availableDates, currentState.bookingData.service);
          await vkBotServer.sendMessage(userId, dateMessage.text, dateMessage.keyboard);
        }
        break;
        
      default:
        await this.handleUnknownCommand(message);
    }
  }

  /**
   * Обработка ввода в зависимости от состояния
   */
  private async handleStateInput(message: VKMessage, state: DialogState): Promise<void> {
    const userId = message.from_id;
    const text = message.text.trim();
    
    try {
      switch (state) {
        case DialogState.SELECTING_SERVICE:
          await this.handleServiceSelection(userId, text);
          break;
          
        case DialogState.SELECTING_DATE:
          await this.handleDateSelection(userId, text);
          break;
          
        case DialogState.SELECTING_TIME:
          await this.handleTimeSelection(userId, text);
          break;
          
        case DialogState.ENTERING_NAME:
          await this.handleNameInput(userId, text);
          break;
          
        case DialogState.CONFIRMING_BOOKING:
          await this.handleBookingConfirmation(userId, text);
          break;
          
        default:
          await this.handleUnknownCommand(message);
      }
    } catch (error) {
      console.error('Error handling state input:', error);
      const errorMessage = messageFormatter.formatError('Ошибка обработки ввода. Попробуйте еще раз.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }

  /**
   * Обработка выбора услуги
   */
  private async handleServiceSelection(userId: number, serviceName: string): Promise<void> {
    // Проверяем существование услуги
    const serviceInfo = await vkBookingService.getServiceInfo(serviceName);
    
    if (!serviceInfo) {
      await vkBotServer.sendMessage(userId, '❌ Услуга не найдена. Выберите услугу из списка.');
      return;
    }
    
    // Сохраняем выбранную услугу
    await stateManager.updateBookingData(userId, { service: serviceName });
    
    // Получаем доступные даты для услуги
    const availableDates = await vkBookingService.getAvailableDates(serviceName);
    
    if (availableDates.length === 0) {
      const errorMessage = messageFormatter.formatError('Для этой услуги нет свободных слотов на ближайшие 2 недели.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
      return;
    }
    
    // Переходим к выбору даты
    await stateManager.transitionTo(userId, DialogState.SELECTING_DATE);
    
    // Показываем доступные даты с кнопками
    const dateMessage = messageFormatter.formatDateSelection(availableDates, serviceName);
    await vkBotServer.sendMessage(userId, dateMessage.text, dateMessage.keyboard);
  }

  /**
   * Обработка выбора даты
   */
  private async handleDateSelection(userId: number, dateInput: string): Promise<void> {
    const currentState = await stateManager.getUserState(userId);
    const { service } = currentState.bookingData;
    
    if (!service) {
      await this.handleCancelCommand({ from_id: userId } as VKMessage);
      return;
    }
    
    let selectedDate: string | null = null;
    
    // Получаем доступные даты
    const availableDates = await vkBookingService.getAvailableDates(service);
    
    // Проверяем ввод по дате
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateInput) && availableDates.includes(dateInput)) {
      selectedDate = dateInput;
    }
    
    if (!selectedDate) {
      await vkBotServer.sendMessage(userId, '❌ Дата не найдена. Выберите дату из списка.');
      return;
    }
    
    // Сохраняем выбранную дату
    await stateManager.updateBookingData(userId, { date: selectedDate });
    
    // Получаем доступные слоты на эту дату
    const availableSlots = await vkBookingService.getAvailableSlots(service, selectedDate);
    
    if (availableSlots.length === 0) {
      await vkBotServer.sendMessage(userId, '❌ На выбранную дату нет свободных слотов. Выберите другую дату.');
      return;
    }
    
    // Переходим к выбору времени
    await stateManager.transitionTo(userId, DialogState.SELECTING_TIME);
    
    // Показываем доступные слоты с кнопками
    const slotsMessage = messageFormatter.formatAvailableSlots(availableSlots, selectedDate, service);
    await vkBotServer.sendMessage(userId, slotsMessage.text, slotsMessage.keyboard);
  }

  /**
   * Обработка выбора времени
   */
  private async handleTimeSelection(userId: number, timeInput: string): Promise<void> {
    const currentState = await stateManager.getUserState(userId);
    const { service, date } = currentState.bookingData;
    
    if (!service || !date) {
      await this.handleCancelCommand({ from_id: userId } as VKMessage);
      return;
    }
    
    // Проверяем формат времени
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(timeInput)) {
      await vkBotServer.sendMessage(userId, '❌ Неверный формат времени. Выберите время из списка.');
      return;
    }
    
    // Проверяем доступность слота
    const isAvailable = await vkBookingService.isSlotAvailable(service, date, timeInput);
    
    if (!isAvailable) {
      await vkBotServer.sendMessage(userId, '❌ Выбранное время недоступно. Выберите другое время из списка.');
      return;
    }
    
    // Сохраняем выбранное время
    await stateManager.updateBookingData(userId, { time: timeInput });
    
    // Переходим к вводу имени
    await stateManager.transitionTo(userId, DialogState.ENTERING_NAME);
    
    const text = `✅ Услуга: ${service}\n✅ Дата: ${vkBookingService.formatDateForDisplay(date)}\n✅ Время: ${timeInput}\n\n👤 Как вас зовут?\n\nНапишите ваше имя:`;
    
    await vkBotServer.sendMessage(userId, text);
  }

  /**
   * Обработка ввода имени
   */
  private async handleNameInput(userId: number, name: string): Promise<void> {
    if (name.length < 2) {
      await vkBotServer.sendMessage(userId, '❌ Имя слишком короткое. Введите ваше имя (минимум 2 символа):');
      return;
    }
    
    if (name.length > 50) {
      await vkBotServer.sendMessage(userId, '❌ Имя слишком длинное. Введите ваше имя (максимум 50 символов):');
      return;
    }
    
    // Сохраняем имя
    await stateManager.updateBookingData(userId, { 
      clientName: name,
      vkUserId: userId,
      vkProfile: vkBookingService.generateVKProfile(userId)
    });
    
    // Переходим к подтверждению
    await stateManager.transitionTo(userId, DialogState.CONFIRMING_BOOKING);
    
    const currentState = await stateManager.getUserState(userId);
    const bookingData = currentState.bookingData;
    
    let text = `📋 ПОДТВЕРЖДЕНИЕ ЗАПИСИ\n\n`;
    text += `🎨 Услуга: ${bookingData.service}\n`;
    text += `📅 Дата: ${vkBookingService.formatDateForDisplay(bookingData.date!)}\n`;
    text += `⏰ Время: ${bookingData.time}\n`;
    text += `👥 Клиент: ${bookingData.clientName}\n\n`;
    text += `❓ Подтвердить запись?\n\n`;
    text += `Напишите "Да" для подтверждения или "Нет" для отмены.`;
    
    await vkBotServer.sendMessage(userId, text);
  }

  /**
   * Обработка подтверждения бронирования
   */
  private async handleBookingConfirmation(userId: number, confirmation: string): Promise<void> {
    const confirmText = confirmation.toLowerCase().trim();
    
    if (confirmText === 'да' || confirmText === 'yes' || confirmText === 'подтверждаю') {
      await this.createBooking(userId);
    } else if (confirmText === 'нет' || confirmText === 'no' || confirmText === 'отмена') {
      await this.handleCancelCommand({ from_id: userId } as VKMessage);
    } else {
      await vkBotServer.sendMessage(userId, '❓ Напишите "Да" для подтверждения записи или "Нет" для отмены.');
    }
  }

  /**
   * Создание бронирования
   */
  private async createBooking(userId: number): Promise<void> {
    try {
      const currentState = await stateManager.getUserState(userId);
      const bookingData = currentState.bookingData;
      
      // Проверяем полноту данных
      if (!bookingData.service || !bookingData.date || 
          !bookingData.time || !bookingData.clientName) {
        const errorMessage = messageFormatter.formatError('Неполные данные для записи. Начните заново.');
        await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
        return;
      }
      
      // Создаем бронирование
      const result = await vkBookingService.createVKBooking({
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        clientName: bookingData.clientName,
        vkProfile: vkBookingService.generateVKProfile(userId),
        vkUserId: userId
      });
      
      if (result.success && result.booking) {
        // Успешное создание
        const confirmationMessage = messageFormatter.formatBookingConfirmation(result.booking);
        await vkBotServer.sendMessage(userId, confirmationMessage.text, confirmationMessage.keyboard);
        
        // Очищаем состояние
        await stateManager.transitionTo(userId, DialogState.IDLE);
        
        console.log(`Booking created successfully for user ${userId}`);
      } else {
        // Ошибка создания
        const errorMessage = messageFormatter.formatError(
          result.errors.join(', ') || 'Ошибка создания записи'
        );
        await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = messageFormatter.formatError('Ошибка создания записи. Попробуйте еще раз.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
    }
  }
}

// Экспорт singleton instance
export const commandHandlers = new CommandHandlers();