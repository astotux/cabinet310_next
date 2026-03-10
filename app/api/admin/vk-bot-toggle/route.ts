import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const VK_BOT_STATUS_FILE = join(process.cwd(), '.vk-bot-status.json');

/**
 * POST /api/admin/vk-bot-toggle
 * 
 * Переключение состояния VK бота
 */
export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();
    
    // Сохраняем состояние в файл
    const status = { enabled: Boolean(enabled), updatedAt: new Date().toISOString() };
    writeFileSync(VK_BOT_STATUS_FILE, JSON.stringify(status, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      enabled: status.enabled,
      message: `VK бот ${status.enabled ? 'включен' : 'выключен'}`
    });
  } catch (error) {
    console.error('Error toggling VK bot:', error);
    return NextResponse.json(
      { error: 'Ошибка переключения VK бота' },
      { status: 500 }
    );
  }
}