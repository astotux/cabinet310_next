// VK Bot Webhook API endpoint

import { NextRequest, NextResponse } from "next/server";
import { vkBotServer } from "@/lib/vk-bot/server";
import { VKEvent } from "@/lib/vk-bot/types";

/**
 * POST /api/vk-bot/webhook
 * 
 * Обработка webhook'ов от ВКонтакте
 */
export async function POST(request: NextRequest) {
  try {
    const event: VKEvent = await request.json();
    
    console.log('Received VK webhook:', JSON.stringify(event));
    
    // Специальная обработка подтверждения сервера
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
  return NextResponse.json({
    status: 'ok',
    message: 'VK webhook is worked',
    timestamp: new Date().toISOString()
  });
}