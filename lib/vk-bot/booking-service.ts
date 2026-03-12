// VK Booking Service - сервис для работы с бронированиями через ВК бота

import { prisma } from '@/lib/prisma';
import { validateBookingWithAvailability, BookingData } from '@/lib/booking/validator';
import { VKBookingData, ServiceInfo, BookingResult } from './types';

export class VKBookingService {
  /**
   * Создание бронирования через ВК бота
   */
  async createVKBooking(bookingData: VKBookingData): Promise<BookingResult> {
    try {
      // Формируем VK профиль из user ID
      const vkProfile = `vk.com/id${bookingData.vkUserId}`;
      
      // Получаем информацию об услуге для определения мастера и длительности
      const serviceInfo = await prisma.price.findFirst({
        where: { service: bookingData.service }
      });

      if (!serviceInfo) {
        return {
          success: false,
          errors: ['Услуга не найдена']
        };
      }

      // Подготавливаем данные для валидации (используем мастера из услуги)
      const validationData: BookingData = {
        service: bookingData.service,
        master: serviceInfo.master, // Берем мастера из услуги
        date: bookingData.date,
        time: bookingData.time,
        clientName: bookingData.clientName,
        vkProfile: vkProfile,
        vkUserId: bookingData.vkUserId,
      };

      // Валидируем данные и проверяем доступность
      const validation = await validateBookingWithAvailability(
        validationData,
        serviceInfo.duration
      );

      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Создаем бронирование через API
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: bookingData.service,
          master: serviceInfo.master, // Используем мастера из услуги
          date: bookingData.date,
          time: bookingData.time,
          clientName: bookingData.clientName,
          vkProfile: vkProfile,
          vkUserId: bookingData.vkUserId,
          skipNotification: false, // Отправляем уведомления админам
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          errors: [errorData.error || 'Ошибка создания бронирования']
        };
      }

      const createdBooking = await response.json();
      
      return {
        success: true,
        booking: {
          ...bookingData,
          vkProfile: vkProfile
        },
        errors: []
      };

    } catch (error) {
      console.error('Error creating VK booking:', error);
      return {
        success: false,
        errors: ['Внутренняя ошибка сервера']
      };
    }
  }

  /**
   * Получение доступных услуг
   */
  async getAvailableServices(): Promise<ServiceInfo[]> {
    try {
      const services = await prisma.price.findMany({
        orderBy: [
          { category: 'asc' },
          { service: 'asc' }
        ]
      });

      return services.map(service => ({
        service: service.service,
        description: service.description || '',
        category: service.category,
        master: service.master,
        duration: service.duration,
        price: service.price
      }));
    } catch (error) {
      console.error('Error getting available services:', error);
      return [];
    }
  }

  /**
   * Получение доступных категорий услуг
   */
  async getAvailableCategories(): Promise<string[]> {
    try {
      const services = await prisma.price.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' }
      });

      return services.map(s => s.category);
    } catch (error) {
      console.error('Error getting available categories:', error);
      return [];
    }
  }

  /**
   * Получение услуг по категории
   */
  async getServicesByCategory(category: string): Promise<ServiceInfo[]> {
    try {
      const services = await prisma.price.findMany({
        where: { category: category },
        orderBy: { service: 'asc' }
      });

      return services.map(service => ({
        service: service.service,
        description: service.description || '',
        category: service.category,
        master: service.master,
        duration: service.duration,
        price: service.price
      }));
    } catch (error) {
      console.error('Error getting services by category:', error);
      return [];
    }
  }

  /**
   * Получение доступных слотов для услуги на дату
   */
  async getAvailableSlots(service: string, date: string): Promise<string[]> {
    try {
      // Получаем информацию об услуге
      const serviceInfo = await prisma.price.findFirst({
        where: { service: service }
      });

      if (!serviceInfo) {
        return [];
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/availability?` +
        `service=${serviceInfo.id}&master=${encodeURIComponent(serviceInfo.master)}&date=${date}`
      );

      if (!response.ok) {
        console.error('Error fetching availability:', response.statusText);
        return [];
      }

      const data = await response.json();
      
      // Фильтруем только доступные слоты
      return data.slots
        .filter((slot: { available: boolean }) => slot.available)
        .map((slot: { time: string }) => slot.time);

    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Валидация VK профиля
   */
  validateVKProfile(vkProfile: string): boolean {
    // Поддерживаемые форматы:
    // vk.com/id123456 (числовой ID)
    // vk.com/username (имя пользователя)
    const vkProfileRegex = /^vk\.com\/(id\d+|[a-zA-Z0-9_]+)$/;
    return vkProfileRegex.test(vkProfile);
  }

  /**
   * Генерация VK профиля из user ID
   */
  generateVKProfile(vkUserId: number): string {
    return `vk.com/id${vkUserId}`;
  }

  /**
   * Получение информации об услуге
   */
  async getServiceInfo(serviceName: string): Promise<ServiceInfo | null> {
    try {
      const service = await prisma.price.findFirst({
        where: { service: serviceName }
      });

      if (!service) {
        return null;
      }

      return {
        service: service.service,
        description: service.description || '',
        category: service.category,
        master: service.master,
        duration: service.duration,
        price: service.price
      };
    } catch (error) {
      console.error('Error getting service info:', error);
      return null;
    }
  }

  /**
   * Проверка доступности конкретного слота
   */
  async isSlotAvailable(service: string, date: string, time: string): Promise<boolean> {
    try {
      const availableSlots = await this.getAvailableSlots(service, date);
      return availableSlots.includes(time);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  }

  /**
   * Получение ближайших доступных дат для услуги
   */
  async getAvailableDates(service: string, daysAhead: number = 45): Promise<string[]> {
    const availableDates: string[] = [];
    const today = new Date();

    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Теперь включаем все дни недели, включая воскресенья
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const slots = await this.getAvailableSlots(service, dateStr);
      
      if (slots.length > 0) {
        availableDates.push(dateStr);
      }
    }

    return availableDates;
  }

  /**
   * Форматирование даты для отображения
   */
  formatDateForDisplay(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Проверяем на сегодня/завтра
      if (date.toDateString() === today.toDateString()) {
        return 'Сегодня';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Завтра';
      }

      // Обычное форматирование
      return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
}

// Экспорт singleton instance
export const vkBookingService = new VKBookingService();