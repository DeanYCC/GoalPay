import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// 簡化的認證檢查函數
async function authenticateRequest(request: NextRequest) {
  // 這裡應該實作您的認證邏輯
  // 暫時返回一個測試用戶ID，實際使用時需要從JWT或session取得
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }
  
  // 簡化版本：假設header包含用戶ID
  // 實際使用時應該驗證JWT token
  const userId = authHeader.replace('Bearer ', '');
  return userId;
}

// GET /api/user-settings - 取得使用者設定
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userSettings: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 如果沒有設定，返回預設值
    if (!user.userSettings) {
      const defaultSettings = {
        language: 'zh-TW',
        theme: 'light',
        defaultCurrency: 'JPY',
        dateFormat: 'YYYY-MM-DD',
        notificationsEnabled: true,
        emailNotifications: true,
        timezone: 'Asia/Tokyo'
      };
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(user.userSettings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user-settings - 更新使用者設定
export async function PUT(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      language,
      theme,
      defaultCurrency,
      dateFormat,
      notificationsEnabled,
      emailNotifications,
      timezone
    } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 更新或建立設定
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        language,
        theme,
        defaultCurrency,
        dateFormat,
        notificationsEnabled,
        emailNotifications,
        timezone
      },
      create: {
        userId: user.id,
        language,
        theme,
        defaultCurrency,
        dateFormat,
        notificationsEnabled,
        emailNotifications,
        timezone
      }
    });

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
