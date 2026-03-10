// Command Handlers - обработчики команд VK бота

import { VKMessage, DialogState, CommandType } from './types';
import { messageFormatter } from './message-formatter';
import { vkBookingService } from './booking-service';
import { stateManager } from './state-manager';
import { vkBotServer } from './server';

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
   * Обработчик команды "Помощь"
   */
  async handleHelpCommand(message: VKMessage): Promise<void> {
    const userId = message.from_id;
    
    try {
      // Отправляем справочное сообщение
      const helpMessage = messageFormatter.formatHelp();
      await vkBotServer.sendMessage(userId, helpMessage.text, helpMessage.keyboard);
      
      console.log(`Help command handled for user ${userId}`);
    } catch (error) {
      console.error('Error handling help command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка получения справки.');
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
      const currentState = await stateManager.getUserState(userId);
      
      // Если пользователь в процессе бронирования, обрабатываем как ввод данных
      if (currentState.currentState !== DialogState.IDLE) {
        await this.handleStateInput(message, currentState.currentState);
        return;
      }
      
      // Иначе показываем сообщение о неизвестной команде
      let text = `❓ Не понимаю команду "${message.text}"\n\n`;
      text += 'Доступные команды:\n';
      text += '• 📋 Прайс - посмотреть услуги и цены\n';
      text += '• ✍️ Записаться - записаться на услугу\n';
      text += '• ❓ Помощь - получить справку\n\n';
      text += 'Или выберите действие из меню:';
      
      const welcomeMessage = messageFormatter.formatWelcome();
      await vkBotServer.sendMessage(userId, text, welcomeMessage.keyboard);
      
      console.log(`Unknown command handled for user ${userId}: ${message.text}`);
    } catch (error) {
      console.error('Error handling unknown command:', error);
      const errorMessage = messageFormatter.formatError('Ошибка обработки команды.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
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
          
        case DialogState.SELECTING_MASTER:
          await this.handleMasterSelection(userId, text);
          break;
          
        case DialogState.SELECTING_SLOT:
          await this.handleSlotSelection(userId, text);
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
    
    // Получаем доступных мастеров
    const masters = await vkBookingService.getAvailableMasters(serviceName);
    
    if (masters.length === 0) {
      const errorMessage = messageFormatter.formatError('Для этой услуги нет доступных мастеров.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
      return;
    }
    
    // Переходим к выбору мастера
    await stateManager.transitionTo(userId, DialogState.SELECTING_MASTER);
    
    // Формируем сообщение с мастерами
    let text = `✅ Услуга: ${serviceName}\n\n👤 **ВЫБЕРИТЕ МАСТЕРА:**\n\n`;
    masters.forEach((master, index) => {
      text += `${index + 1}. ${master}\n`;
    });
    text += '\n💬 Напишите имя мастера или номер из списка';
    
    await vkBotServer.sendMessage(userId, text);
  }

  /**
   * Обработка выбора мастера
   */
  private async handleMasterSelection(userId: number, masterInput: string): Promise<void> {
    const currentState = await stateManager.getUserState(userId);
    const serviceName = currentState.bookingData.service;
    
    if (!serviceName) {
      await this.handleCancelCommand({ from_id: userId } as VKMessage);
      return;
    }
    
    // Получаем список мастеров
    const masters = await vkBookingService.getAvailableMasters(serviceName);
    let selectedMaster: string | null = null;
    
    // Проверяем ввод по номеру
    const masterIndex = parseInt(masterInput) - 1;
    if (!isNaN(masterIndex) && masterIndex >= 0 && masterIndex < masters.length) {
      selectedMaster = masters[masterIndex];
    } else {
      // Проверяем ввод по имени
      selectedMaster = masters.find(master => 
        master.toLowerCase() === masterInput.toLowerCase()
      ) || null;
    }
    
    if (!selectedMaster) {
      await vkBotServer.sendMessage(userId, '❌ Мастер не найден. Выберите мастера из списка.');
      return;
    }
    
    // Сохраняем выбранного мастера
    await stateManager.updateBookingData(userId, { master: selectedMaster });
    
    // Получаем доступные даты
    const availableDates = await vkBookingService.getAvailableDates(serviceName, selectedMaster);
    
    if (availableDates.length === 0) {
      const errorMessage = messageFormatter.formatError('У этого мастера нет свободных слотов на ближайшие 2 недели.');
      await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
      return;
    }
    
    // Переходим к выбору слота
    await stateManager.transitionTo(userId, DialogState.SELECTING_SLOT);
    
    // Показываем доступные даты
    let text = `✅ Услуга: ${serviceName}\n✅ Мастер: ${selectedMaster}\n\n📅 **ДОСТУПНЫЕ ДАТЫ:**\n\n`;
    
    for (let i = 0; i < Math.min(availableDates.length, 7); i++) {
      const date = availableDates[i];
      const displayDate = vkBookingService.formatDateForDisplay(date);
      text += `${i + 1}. ${displayDate} (${date})\n`;
    }
    
    text += '\n💬 Напишите номер даты или дату в формате ГГГГ-ММ-ДД';
    
    await vkBotServer.sendMessage(userId, text);
  }

  /**
   * Обработка выбора слота
   */
  private async handleSlotSelection(userId: number, input: string): Promise<void> {
    const currentState = await stateManager.getUserState(userId);
    const { service, master } = currentState.bookingData;
    
    if (!service || !master) {
      await this.handleCancelCommand({ from_id: userId } as VKMessage);
      return;
    }
    
    // Если еще не выбрана дата, обрабатываем выбор даты
    if (!currentState.bookingData.date) {
      await this.handleDateSelection(userId, input, service, master);
      return;
    }
    
    // Если дата уже выбрана, обрабатываем выбор времени
    await this.handleTimeSelection(userId, input, service, master, currentState.bookingData.date);
  }

  /**
   * Обработка выбора даты
   */
  private async handleDateSelection(userId: number, dateInput: string, service: string, master: string): Promise<void> {
    let selectedDate: string | null = null;
    
    // Получаем доступные даты
    const availableDates = await vkBookingService.getAvailableDates(service, master);
    
    // Проверяем ввод по номеру
    const dateIndex = parseInt(dateInput) - 1;
    if (!isNaN(dateIndex) && dateIndex >= 0 && dateIndex < availableDates.length) {
      selectedDate = availableDates[dateIndex];
    } else {
      // Проверяем ввод по дате
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(dateInput) && availableDates.includes(dateInput)) {
        selectedDate = dateInput;
      }
    }
    
    if (!selectedDate) {
      await vkBotServer.sendMessage(userId, '❌ Дата не найдена. Выберите дату из списка.');
      return;
    }
    
    // Сохраняем выбранную дату
    await stateManager.updateBookingData(userId, { date: selectedDate });
    
    // Получаем доступные слоты на эту дату
    const availableSlots = await vkBookingService.getAvailableSlots(service, master, selectedDate);
    
    if (availableSlots.length === 0) {
      await vkBotServer.sendMessage(userId, '❌ На выбранную дату нет свободных слотов. Выберите другую дату.');
      return;
    }
    
    // Показываем доступные слоты
    const slotsMessage = messageFormatter.formatAvailableSlots(availableSlots, selectedDate, service, master);
    await vkBotServer.sendMessage(userId, slotsMessage.text, slotsMessage.keyboard);
  }

  /**
   * Обработка выбора времени
   */
  private async handleTimeSelection(userId: number, timeInput: string, service: string, master: string, date: string): Promise<void> {
    // Проверяем формат времени
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(timeInput)) {
      await vkBotServer.sendMessage(userId, '❌ Неверный формат времени. Используйте формат ЧЧ:ММ (например: 14:30)');
      return;
    }
    
    // Проверяем доступность слота
    const isAvailable = await vkBookingService.isSlotAvailable(service, master, date, timeInput);
    
    if (!isAvailable) {
      await vkBotServer.sendMessage(userId, '❌ Выбранное время недоступно. Выберите другое время из списка.');
      return;
    }
    
    // Сохраняем выбранное время
    await stateManager.updateBookingData(userId, { time: timeInput });
    
    // Переходим к вводу имени
    await stateManager.transitionTo(userId, DialogState.ENTERING_NAME);
    
    const text = `✅ Услуга: ${service}\n✅ Мастер: ${master}\n✅ Дата: ${vkBookingService.formatDateForDisplay(date)}\n✅ Время: ${timeInput}\n\n👤 **Как вас зовут?**\n\nНапишите ваше имя:`;
    
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
    
    let text = `📋 **ПОДТВЕРЖДЕНИЕ ЗАПИСИ**\n\n`;
    text += `🎨 Услуга: ${bookingData.service}\n`;
    text += `👤 Мастер: ${bookingData.master}\n`;
    text += `📅 Дата: ${vkBookingService.formatDateForDisplay(bookingData.date!)}\n`;
    text += `⏰ Время: ${bookingData.time}\n`;
    text += `👥 Клиент: ${bookingData.clientName}\n\n`;
    text += `❓ **Подтвердить запись?**\n\n`;
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
      if (!bookingData.service || !bookingData.master || !bookingData.date || 
          !bookingData.time || !bookingData.clientName) {
        const errorMessage = messageFormatter.formatError('Неполные данные для записи. Начните заново.');
        await vkBotServer.sendMessage(userId, errorMessage.text, errorMessage.keyboard);
        return;
      }
      
      // Создаем бронирование
      const result = await vkBookingService.createVKBooking({
        service: bookingData.service,
        master: bookingData.master,
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