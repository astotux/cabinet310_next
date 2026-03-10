// Command Parser - парсинг команд и определение намерений пользователя

import { VKMessage, CommandType, CommandParameters, ParsedCommand } from './types';

export class CommandParser {
  /**
   * Парсинг входящего сообщения
   */
  parseMessage(message: VKMessage): ParsedCommand {
    const text = message.text.trim().toLowerCase();
    const commandType = this.getCommandType(text);
    const parameters = this.extractParameters(text, commandType);

    return {
      type: commandType,
      parameters,
      isValid: this.validateCommand(commandType, parameters),
      errors: this.getValidationErrors(commandType, parameters)
    };
  }

  /**
   * Определение типа команды
   */
  getCommandType(text: string): CommandType {
    // Команда "Начать"
    if (this.matchesCommand(text, ['начать', 'start', '/start', 'привет', 'hello'])) {
      return CommandType.START;
    }

    // Команда "Прайс"
    if (this.matchesCommand(text, ['прайс', 'услуги', 'цены', 'price', 'services'])) {
      return CommandType.PRICE;
    }

    // Команда "Записаться"
    if (this.matchesCommand(text, ['записаться', 'запись', 'book', 'booking'])) {
      return CommandType.BOOK;
    }

    // Команда "Связаться с человеком"
    if (this.matchesCommand(text, ['связаться с человеком', 'человек', 'помощь', 'help', '/help', 'что ты умеешь', 'администратор', 'админ'])) {
      return CommandType.CONTACT_HUMAN;
    }

    // Команда "Отмена"
    if (this.matchesCommand(text, ['отмена', 'cancel', 'стоп', 'stop', 'назад', 'back'])) {
      return CommandType.CANCEL;
    }

    return CommandType.UNKNOWN;
  }

  /**
   * Проверка соответствия текста команде
   */
  private matchesCommand(text: string, commands: string[]): boolean {
    return commands.some(cmd => 
      text === cmd || 
      text.startsWith(cmd + ' ') ||
      text.includes(cmd)
    );
  }

  /**
   * Извлечение параметров команды
   */
  extractParameters(text: string, commandType: CommandType): CommandParameters {
    const parameters: CommandParameters = {};

    // Пока что возвращаем пустые параметры
    // В будущем здесь можно добавить извлечение параметров из текста
    // Например: "записаться на маникюр к лизе на завтра"

    return parameters;
  }

  /**
   * Валидация команды
   */
  private validateCommand(commandType: CommandType, parameters: CommandParameters): boolean {
    // Базовые команды всегда валидны
    if ([CommandType.START, CommandType.PRICE, CommandType.BOOK, CommandType.CONTACT_HUMAN, CommandType.CANCEL].includes(commandType)) {
      return true;
    }

    // Неизвестные команды не валидны
    return false;
  }

  /**
   * Получение ошибок валидации
   */
  private getValidationErrors(commandType: CommandType, parameters: CommandParameters): string[] {
    const errors: string[] = [];

    if (commandType === CommandType.UNKNOWN) {
      errors.push('Неизвестная команда');
    }

    return errors;
  }

  /**
   * Проверка является ли сообщение командой
   */
  isCommand(text: string): boolean {
    const commandType = this.getCommandType(text.toLowerCase());
    return commandType !== CommandType.UNKNOWN;
  }

  /**
   * Получение списка доступных команд
   */
  getAvailableCommands(): string[] {
    return [
      '📋 Прайс - посмотреть список услуг и цены',
      '✍️ Записаться - записаться на услугу',
      '👤 Связаться с человеком - получить помощь от администратора',
      '❌ Отмена - отменить текущее действие'
    ];
  }
}

// Экспорт singleton instance
export const commandParser = new CommandParser();