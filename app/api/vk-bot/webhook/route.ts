// VK Bot Webhook API endpoint

import { NextRequest, NextResponse } from "next/server";
import { vkBotServer } from "@/lib/vk-bot/server";
import { VKEvent } from "@/lib/vk-bot/types";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const VK_BOT_STATUS_FILE = join(process.cwd(), '.vk-bot-status.json');

/**
 * Проверка статуса VK бота
 */
function isVkBotEnabled(): boolean {
  try {
    if (existsSync(VK_BOT_STATUS_FILE)) {
      const statusData = readFileSync(VK_BOT_STATUS_FILE, 'utf-8');
      const status = JSON.parse(statusData);
      return status.enabled;
    }
    return true; // По умолчанию включен
  } catch (error) {
    console.error('Error reading VK bot status:', error);
    return true; // В случае ошибки считаем включенным
  }
}

/**
 * POST /api/vk-bot/webhook
 * 
 * Обработка webhook'ов от ВКонтакте
 */
export async function POST(request: NextRequest) {
  try {
    const event: VKEvent = await request.json();
    
    console.log('Received VK webhook:', JSON.stringify(event));
    
    // Специальная обработка подтверждения сервера (всегда отвечаем)
    if (event.type === 'confirmation') {
      console.log('VK confirmation request for group:', event.group_id);
      
      // Проверяем что это наша группа
      if (event.group_id === 184713912) {
        console.log('Returning confirmation token: f8b32dee');
        return new NextResponse('f8b32dee', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      } else {
        console.log('Unknown group ID:', event.group_id);
        return new NextResponse('error', {
          status: 400,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }
    }
    
    // Проверяем статус бота для обычных сообщений
    if (!isVkBotEnabled()) {
      console.log('VK bot is disabled, ignoring message');
      return new NextResponse('ok', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
    // Обработка остальных событий через VK Bot Server
    const response = await vkBotServer.handleWebhook(event);
    
    return new NextResponse(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error processing VK webhook:', error);
    
    return new NextResponse('error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * GET /api/vk-bot/webhook
 * 
 * Проверка статуса webhook'а
 */
export async function GET() {
  const botEnabled = isVkBotEnabled();
  
  return NextResponse.json({
    status: 'ok',
    botEnabled,
    message: `VK webhook is working, bot is ${botEnabled ? 'enabled' : 'disabled'}`,
    timestamp: new Date().toISOString()
  });
}