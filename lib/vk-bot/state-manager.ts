// State Manager - управление состояниями диалога пользователей

import { prisma } from '@/lib/prisma';
import { DialogState, UserState, VKBookingData } from './types';

export class StateManager {
  /**
   * Получение текущего состояния пользователя
   */
  async getUserState(userId: number): Promise<UserState> {
    try {
      const dbState = await (prisma as any).vKUserState.findUnique({
        where: { vkUserId: userId }
      });

      if (!dbState) {
        // Создаем новое состояние для пользователя
        const newState: UserState = {
          userId,
          currentState: DialogState.IDLE,
          bookingData: {},
          lastActivity: new Date(),
          messageHistory: []
        };

        await this.saveUserState(newState);
        return newState;
      }

      // Парсим данные бронирования из JSON
      let bookingData: Partial<VKBookingData> = {};
      if (dbState.bookingData) {
        try {
          bookingData = JSON.parse(dbState.bookingData);
        } catch (error) {
          console.error('Error parsing booking data:', error);
        }
      }

      return {
        userId,
        currentState: dbState.currentState as DialogState,
        bookingData,
        lastActivity: dbState.lastActivity,
        messageHistory: [] // Пока не сохраняем историю сообщений
      };
    } catch (error) {
      console.error('Error getting user state:', error);
      
      // Возвращаем дефолтное состояние в случае ошибки
      return {
        userId,
        currentState: DialogState.IDLE,
        bookingData: {},
        lastActivity: new Date(),
        messageHistory: []
      };
    }
  }

  /**
   * Обновление состояния пользователя
   */
  async updateUserState(userId: number, state: UserState): Promise<void> {
    try {
      await this.saveUserState(state);
    } catch (error) {
      console.error('Error updating user state:', error);
      throw error;
    }
  }

  /**
   * Сохранение состояния в базу данных
   */
  private async saveUserState(state: UserState): Promise<void> {
    const bookingDataJson = JSON.stringify(state.bookingData);

    await (prisma as any).vKUserState.upsert({
      where: { vkUserId: state.userId },
      update: {
        currentState: state.currentState,
        bookingData: bookingDataJson,
        lastActivity: state.lastActivity,
      },
      create: {
        vkUserId: state.userId,
        currentState: state.currentState,
        bookingData: bookingDataJson,
        lastActivity: state.lastActivity,
      }
    });
  }

  /**
   * Очистка состояния пользователя
   */
  async clearUserState(userId: number): Promise<void> {
    try {
      await (prisma as any).vKUserState.delete({
        where: { vkUserId: userId }
      });
      console.log(`Cleared state for user ${userId}`);
    } catch (error) {
      // Игнорируем ошибку если запись не найдена
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        console.log(`No state to clear for user ${userId}`);
      } else {
        console.error('Error clearing user state:', error);
        throw error;
      }
    }
  }

  /**
   * Переход к следующему состоянию
   */
  async transitionTo(userId: number, newState: DialogState, data?: any): Promise<void> {
    try {
      const currentState = await this.getUserState(userId);
      
      // Обновляем состояние
      currentState.currentState = newState;
      currentState.lastActivity = new Date();

      // Добавляем дополнительные данные если переданы
      if (data) {
        currentState.bookingData = { ...currentState.bookingData, ...data };
      }

      await this.updateUserState(userId, currentState);
      console.log(`User ${userId} transitioned to state: ${newState}`);
    } catch (error) {
      console.error('Error transitioning user state:', error);
      throw error;
    }
  }

  /**
   * Обновление данных бронирования
   */
  async updateBookingData(userId: number, data: Partial<VKBookingData>): Promise<void> {
    try {
      const currentState = await this.getUserState(userId);
      currentState.bookingData = { ...currentState.bookingData, ...data };
      currentState.lastActivity = new Date();
      
      await this.updateUserState(userId, currentState);
      console.log(`Updated booking data for user ${userId}:`, data);
    } catch (error) {
      console.error('Error updating booking data:', error);
      throw error;
    }
  }

  /**
   * Проверка валидности состояния
   */
  isValidState(state: DialogState): boolean {
    return Object.values(DialogState).includes(state);
  }

  /**
   * Получение следующего состояния в процессе бронирования
   */
  getNextBookingState(currentState: DialogState): DialogState | null {
    const stateFlow: Record<DialogState, DialogState | null> = {
      [DialogState.IDLE]: DialogState.SELECTING_SERVICE,
      [DialogState.SELECTING_SERVICE]: DialogState.SELECTING_DATE,
      [DialogState.SELECTING_DATE]: DialogState.SELECTING_TIME,
      [DialogState.SELECTING_TIME]: DialogState.ENTERING_NAME,
      [DialogState.ENTERING_NAME]: DialogState.CONFIRMING_BOOKING,
      [DialogState.CONFIRMING_BOOKING]: null, // Конечное состояние
    };

    return stateFlow[currentState] || null;
  }

  /**
   * Очистка старых состояний (старше 24 часов)
   */
  async cleanupOldStates(): Promise<void> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await (prisma as any).vKUserState.deleteMany({
        where: {
          lastActivity: {
            lt: oneDayAgo
          }
        }
      });

      console.log(`Cleaned up ${result.count} old user states`);
    } catch (error) {
      console.error('Error cleaning up old states:', error);
    }
  }
}

// Экспорт singleton instance
export const stateManager = new StateManager();