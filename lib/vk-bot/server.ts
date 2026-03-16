// VK Bot Server - основной сервер для обработки webhook'ов ВКонтакте

import { VKEvent, VKMessage, VKKeyboard, CommandType } from './types';
import { commandParser } from './command-parser';
import { commandHandlers } from './command-handlers';

const VK_ACCESS_TOKEN = process.env.VK_BOT_ACCESS_TOKEN;
const VK_GROUP_ID = process.env.VK_GROUP_ID;
const VK_CONFIRMATION_TOKEN = process.env.VK_CONFIRMATION_TOKEN;

export class VKBotServer {
  private isRunning = false;
  private processedEventIds = new Set<string>();
  private readonly EVENT_ID_TTL_MS = 60_000; // 1 минута

  /**
   * Обработка входящих webhook'ов от ВКонтакте
   */
  async handleWebhook(event: VKEvent): Promise<string> {
    try {
      console.log('Received VK event:', event.type);

      // Обработка подтверждения сервера
      if (event.type === 'confirmation') {
        return VK_CONFIRMATION_TOKEN || '';
      }

      // Обработка новых сообщений
      if (event.type === 'message_new' && event.object.message) {
        // Дедупликация: игнорируем повторные доставки одного события
        if (event.event_id) {
          if (this.processedEventIds.has(event.event_id)) {
            console.log(`Duplicate event ignored: ${event.event_id}`);
            return 'ok';
          }
          this.processedEventIds.add(event.event_id);
          // Чистим старые id через минуту
          setTimeout(() => this.processedEventIds.delete(event.event_id), this.EVENT_ID_TTL_MS);
        }

        await this.handleMessage(event.object.message);
        return 'ok';
      }

      return 'ok';
    } catch (error) {
      console.error('Error handling VK webhook:', error);
      return 'error';
    }
  }

  /**
   * Обработка входящего сообщения
   */
  private async handleMessage(message: VKMessage): Promise<void> {
    try {
      const userId = message.from_id;
      const text = message.text.trim();

      console.log(`Message from user ${userId}: ${text}`);

      // Парсим команду
      const parsedCommand = commandParser.parseMessage(message);
      
      // Обрабатываем команду
      switch (parsedCommand.type) {
        case CommandType.START:
          await commandHandlers.handleStartCommand(message);
          break;
          
        case CommandType.PRICE:
          await commandHandlers.handlePriceCommand(message);
          break;
          
        case CommandType.BOOK:
          await commandHandlers.handleBookCommand(message);
          break;
          
        case CommandType.CONTACT_HUMAN:
          await commandHandlers.handleContactHumanCommand(message);
          break;
          
        case CommandType.CANCEL:
          await commandHandlers.handleCancelCommand(message);
          break;
          
        case CommandType.UNKNOWN:
        default:
          await commandHandlers.handleUnknownCommand(message);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Отправляем сообщение об ошибке пользователю
      try {
        await this.sendMessage(
          message.from_id, 
          '❌ Произошла ошибка при обработке сообщения. Попробуйте еще раз или обратитесь к администратору.'
        );
      } catch (sendError) {
        console.error('Error sending error message:', sendError);
      }
    }
  }

  // Кеш attachment_id для inmap.png чтобы не загружать каждый раз
  private cachedMapAttachment: string | null = null;

  /**
   * Загружает inmap.png в VK один раз и возвращает attachment string
   */
  private async getMapAttachment(): Promise<string | null> {
    if (this.cachedMapAttachment) return this.cachedMapAttachment;

    if (!VK_ACCESS_TOKEN) return null;

    try {
      // 1. Получаем URL для загрузки
      const uploadServerRes = await fetch('https://api.vk.com/method/photos.getMessagesUploadServer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ access_token: VK_ACCESS_TOKEN, v: '5.131' }),
      });
      const uploadServerData = await uploadServerRes.json();
      if (uploadServerData.error || !uploadServerData.response?.upload_url) {
        console.error('VK upload server error:', uploadServerData.error);
        return null;
      }

      // 2. Читаем файл и загружаем
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'inmap.png');
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: 'image/png' });
      const formData = new FormData();
      formData.append('photo', blob, 'inmap.png');

      const uploadRes = await fetch(uploadServerData.response.upload_url, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      // 3. Сохраняем фото
      const saveRes = await fetch('https://api.vk.com/method/photos.saveMessagesPhoto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          access_token: VK_ACCESS_TOKEN,
          v: '5.131',
          photo: uploadData.photo,
          server: String(uploadData.server),
          hash: uploadData.hash,
        }),
      });
      const saveData = await saveRes.json();

      if (saveData.error || !saveData.response?.[0]) {
        console.error('VK save photo error:', saveData.error);
        return null;
      }

      const photo = saveData.response[0];
      this.cachedMapAttachment = `photo${photo.owner_id}_${photo.id}`;
      console.log('Map photo uploaded to VK:', this.cachedMapAttachment);
      return this.cachedMapAttachment;
    } catch (error) {
      console.error('Failed to upload map photo to VK:', error);
      return null;
    }
  }

  /**
   * Отправка сообщения с картинкой inmap.png
   */
  async sendMessageWithMap(
    userId: number,
    message: string,
    keyboard?: VKKeyboard
  ): Promise<void> {
    const attachment = await this.getMapAttachment();
    await this.sendMessage(userId, message, keyboard, attachment ?? undefined);
  }

  /**
   * Отправка сообщения пользователю
   */
  async sendMessage(
    userId: number, 
    message: string, 
    keyboard?: VKKeyboard,
    attachment?: string
  ): Promise<void> {
    if (!VK_ACCESS_TOKEN) {
      console.warn('VK_BOT_ACCESS_TOKEN not configured');
      return;
    }

    try {
      const params = new URLSearchParams({
        access_token: VK_ACCESS_TOKEN,
        v: '5.131',
        user_id: userId.toString(),
        message: message,
        random_id: Date.now().toString(),
      });

      if (keyboard) {
        params.append('keyboard', JSON.stringify(keyboard));
      }

      if (attachment) {
        params.append('attachment', attachment);
      }

      const response = await fetch('https://api.vk.com/method/messages.send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('VK API error:', data.error);
      } else {
        console.log(`Message sent to user ${userId}`);
      }
    } catch (error) {
      console.error('Failed to send VK message:', error);
    }
  }

  /**
   * Получение информации о пользователе VK
   */
  async getUserInfo(userId: number): Promise<{ first_name: string; last_name: string } | null> {
    if (!VK_ACCESS_TOKEN) {
      console.warn('VK_BOT_ACCESS_TOKEN not configured');
      return null;
    }

    try {
      const params = new URLSearchParams({
        access_token: VK_ACCESS_TOKEN,
        v: '5.131',
        user_ids: userId.toString(),
        fields: 'first_name,last_name'
      });

      const response = await fetch('https://api.vk.com/method/users.get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('VK API error getting user info:', data.error);
        return null;
      }

      if (data.response && data.response[0]) {
        return {
          first_name: data.response[0].first_name,
          last_name: data.response[0].last_name
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get VK user info:', error);
      return null;
    }
  }
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('VK Bot Server is already running');
      return;
    }

    console.log('Starting VK Bot Server...');
    this.isRunning = true;
    console.log('VK Bot Server started successfully');
  }

  /**
   * Остановка сервера
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('VK Bot Server is not running');
      return;
    }

    console.log('Stopping VK Bot Server...');
    this.isRunning = false;
    console.log('VK Bot Server stopped');
  }

  /**
   * Проверка статуса сервера
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }
}

// Экспорт singleton instance
export const vkBotServer = new VKBotServer();