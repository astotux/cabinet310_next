// Error Handler - обработка ошибок VK бота

export enum ErrorType {
  VK_API_ERROR = 'vk_api_error',
  DATABASE_ERROR = 'database_error',
  VALIDATION_ERROR = 'validation_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

export interface BotError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  userId?: number;
  context?: Record<string, any>;
}

export interface ErrorResponse {
  message: string;
  shouldRetry: boolean;
  retryAfter?: number;
  suggestedAction?: string;
}

export interface ErrorContext {
  userId: number;
  command: string;
  state: string;
  timestamp: Date;
}

export class ErrorHandler {
  /**
   * Обработка ошибок VK API
   */
  async handleVKAPIError(error: any): Promise<ErrorResponse> {
    console.error('VK API Error:', error);

    // Обработка специфичных ошибок VK API
    if (error.error_code) {
      switch (error.error_code) {
        case 5: // User authorization failed
          return {
            message: 'Ошибка авторизации. Обратитесь к администратору.',
            shouldRetry: false,
            suggestedAction: 'Свяжитесь с поддержкой'
          };
          
        case 6: // Too many requests per second
          return {
            message: 'Слишком много запросов. Попробуйте через несколько секунд.',
            shouldRetry: true,
            retryAfter: 5000,
            suggestedAction: 'Подождите немного и повторите'
          };
          
        case 9: // Flood control
          return {
            message: 'Превышен лимит сообщений. Попробуйте позже.',
            shouldRetry: true,
            retryAfter: 60000,
            suggestedAction: 'Подождите минуту и повторите'
          };
          
        case 901: // Can\'t send messages for users without permission
          return {
            message: 'Не удается отправить сообщение. Разрешите боту отправлять вам сообщения.',
            shouldRetry: false,
            suggestedAction: 'Проверьте настройки приватности'
          };
          
        default:
          return {
            message: `Ошибка VK API: ${error.error_msg || 'Неизвестная ошибка'}`,
            shouldRetry: false,
            suggestedAction: 'Обратитесь к администратору'
          };
      }
    }

    return {
      message: 'Ошибка связи с ВКонтакте. Попробуйте позже.',
      shouldRetry: true,
      retryAfter: 10000,
      suggestedAction: 'Повторите попытку через несколько секунд'
    };
  }

  /**
   * Обработка ошибок валидации
   */
  handleValidationError(errors: string[]): ErrorResponse {
    const message = errors.length === 1 
      ? `❌ ${errors[0]}` 
      : `❌ Ошибки валидации:\n${errors.map(e => `• ${e}`).join('\n')}`;

    return {
      message,
      shouldRetry: false,
      suggestedAction: 'Исправьте указанные ошибки и попробуйте снова'
    };
  }

  /**
   * Обработка ошибок базы данных
   */
  async handleDatabaseError(error: Error): Promise<ErrorResponse> {
    console.error('Database Error:', error);

    // Проверяем тип ошибки базы данных
    if (error.message.includes('SQLITE_BUSY')) {
      return {
        message: 'База данных временно недоступна. Попробуйте через несколько секунд.',
        shouldRetry: true,
        retryAfter: 3000,
        suggestedAction: 'Подождите и повторите попытку'
      };
    }

    if (error.message.includes('SQLITE_LOCKED')) {
      return {
        message: 'База данных заблокирована. Попробуйте позже.',
        shouldRetry: true,
        retryAfter: 5000,
        suggestedAction: 'Повторите попытку через несколько секунд'
      };
    }

    if (error.message.includes('Connection')) {
      return {
        message: 'Ошибка подключения к базе данных. Попробуйте позже.',
        shouldRetry: true,
        retryAfter: 10000,
        suggestedAction: 'Проверьте подключение и повторите'
      };
    }

    return {
      message: 'Ошибка базы данных. Обратитесь к администратору.',
      shouldRetry: false,
      suggestedAction: 'Свяжитесь с поддержкой'
    };
  }

  /**
   * Обработка сетевых ошибок
   */
  handleNetworkError(error: Error): ErrorResponse {
    console.error('Network Error:', error);

    if (error.message.includes('timeout')) {
      return {
        message: 'Превышено время ожидания. Попробуйте еще раз.',
        shouldRetry: true,
        retryAfter: 5000,
        suggestedAction: 'Проверьте подключение к интернету'
      };
    }

    if (error.message.includes('ECONNREFUSED')) {
      return {
        message: 'Сервис временно недоступен. Попробуйте позже.',
        shouldRetry: true,
        retryAfter: 30000,
        suggestedAction: 'Повторите попытку через полминуты'
      };
    }

    return {
      message: 'Ошибка сети. Проверьте подключение к интернету.',
      shouldRetry: true,
      retryAfter: 10000,
      suggestedAction: 'Проверьте интернет-соединение'
    };
  }

  /**
   * Логирование ошибок
   */
  async logError(error: BotError, context: ErrorContext): Promise<void> {
    const logEntry = {
      timestamp: context.timestamp.toISOString(),
      type: error.type,
      message: error.message,
      userId: context.userId,
      command: context.command,
      state: context.state,
      originalError: error.originalError?.message,
      stack: error.originalError?.stack,
      context: error.context
    };

    // В продакшене здесь можно добавить отправку в систему мониторинга
    console.error('Bot Error Log:', JSON.stringify(logEntry, null, 2));

    // Можно добавить сохранение в базу данных для аналитики
    // await this.saveErrorToDatabase(logEntry);
  }

  /**
   * Создание BotError из обычной ошибки
   */
  createBotError(error: Error, type: ErrorType = ErrorType.UNKNOWN_ERROR, userId?: number): BotError {
    return {
      type,
      message: error.message,
      originalError: error,
      userId,
      context: {
        name: error.name,
        stack: error.stack
      }
    };
  }

  /**
   * Определение типа ошибки по содержимому
   */
  determineErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();

    if (message.includes('vk') || message.includes('api')) {
      return ErrorType.VK_API_ERROR;
    }

    if (message.includes('database') || message.includes('sqlite') || message.includes('prisma')) {
      return ErrorType.DATABASE_ERROR;
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION_ERROR;
    }

    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return ErrorType.NETWORK_ERROR;
    }

    return ErrorType.UNKNOWN_ERROR;
  }

  /**
   * Получение пользовательского сообщения об ошибке
   */
  getUserFriendlyMessage(error: BotError): string {
    switch (error.type) {
      case ErrorType.VK_API_ERROR:
        return '❌ Ошибка связи с ВКонтакте. Попробуйте позже.';
        
      case ErrorType.DATABASE_ERROR:
        return '❌ Ошибка сохранения данных. Попробуйте еще раз.';
        
      case ErrorType.VALIDATION_ERROR:
        return `❌ ${error.message}`;
        
      case ErrorType.NETWORK_ERROR:
        return '❌ Ошибка сети. Проверьте подключение к интернету.';
        
      default:
        return '❌ Произошла ошибка. Попробуйте еще раз или обратитесь к администратору.';
    }
  }

  /**
   * Проверка нужно ли повторить операцию
   */
  shouldRetry(error: BotError): boolean {
    switch (error.type) {
      case ErrorType.VK_API_ERROR:
        // Повторяем только для временных ошибок VK API
        return error.originalError && 
               (error.originalError.message.includes('Too many requests') ||
                error.originalError.message.includes('Flood control'));
                
      case ErrorType.DATABASE_ERROR:
        // Повторяем для ошибок блокировки/занятости БД
        return error.message.includes('BUSY') || error.message.includes('LOCKED');
        
      case ErrorType.NETWORK_ERROR:
        // Повторяем сетевые ошибки
        return true;
        
      case ErrorType.VALIDATION_ERROR:
        // Ошибки валидации не повторяем
        return false;
        
      default:
        return false;
    }
  }

  /**
   * Получение времени задержки перед повтором
   */
  getRetryDelay(error: BotError, attemptNumber: number = 1): number {
    const baseDelay = 1000; // 1 секунда
    const maxDelay = 60000; // 1 минута

    // Экспоненциальная задержка с jitter
    const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay);
    const jitter = Math.random() * 0.1 * delay; // ±10% jitter
    
    return Math.floor(delay + jitter);
  }
}

// Экспорт singleton instance
export const errorHandler = new ErrorHandler();