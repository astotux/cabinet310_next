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
    
    console.log('Received VK webhook:', event.type);
    
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
    message: 'f8b32dee',
    timestamp: new Date().toISOString()
  });
}