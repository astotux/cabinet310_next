// VK Bot Reminders API endpoint

import { NextRequest, NextResponse } from "next/server";
import { vkNotificationService } from "@/lib/vk-bot/notification-service";

/**
 * POST /api/vk-bot/reminders
 * 
 * Отправка запланированных напоминаний
 * Этот endpoint может вызываться cron job'ом
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию (опционально)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting scheduled reminders...');
    
    await vkNotificationService.sendScheduledReminders();
    
    return NextResponse.json({
      success: true,
      message: 'Scheduled reminders sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending scheduled reminders:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send reminders',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vk-bot/reminders
 * 
 * Получение информации о предстоящих напоминаниях
 */
export async function GET() {
  try {
    const upcomingNotifications = await vkNotificationService.getUpcomingBookingsForReminders();
    
    return NextResponse.json({
      count: upcomingNotifications.length,
      notifications: upcomingNotifications.map(n => ({
        vkUserId: n.vkUserId,
        clientName: n.clientName,
        service: n.service,
        master: n.master,
        date: n.date,
        time: n.time,
        type: n.type
      }))
    });
  } catch (error) {
    console.error('Error getting upcoming reminders:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get reminders',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}