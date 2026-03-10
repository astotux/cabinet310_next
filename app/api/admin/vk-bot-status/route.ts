import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const VK_BOT_STATUS_FILE = join(process.cwd(), '.vk-bot-status.json');

/**
 * GET /api/admin/vk-bot-status
 * 
 * Получение текущего состояния VK бота
 */
export async function GET() {
  try {
    let enabled = true; // По умолчанию включен
    
    if (existsSync(VK_BOT_STATUS_FILE)) {
      const statusData = readFileSync(VK_BOT_STATUS_FILE, 'utf-8');
      const status = JSON.parse(statusData);
      enabled = status.enabled;
    }
    
    return NextResponse.json({ 
      enabled,
      message: `VK бот ${enabled ? 'включен' : 'выключен'}`
    });
  } catch (error) {
    console.error('Error getting VK bot status:', error);
    return NextResponse.json(
      { error: 'Ошибка получения статуса VK бота' },
      { status: 500 }
    );
  }
}