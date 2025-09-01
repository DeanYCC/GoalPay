# UserSettings 功能說明

## 概述

UserSettings 是一個完整的使用者設定管理系統，允許使用者自訂應用程式的各種偏好設定，包括語言、主題、貨幣、日期格式、通知設定和時區等。

## 功能特色

### 1. 語言設定 (Language)
- 支援繁體中文 (zh-TW)
- 支援日文 (ja)
- 支援英文 (en)
- 預設值：繁體中文

### 2. 主題設定 (Theme)
- 淺色主題 (light)
- 深色主題 (dark)
- 預設值：淺色主題

### 3. 預設貨幣 (Default Currency)
- 日圓 (JPY) - 預設值
- 美元 (USD)
- 人民幣 (CNY)
- 新台幣 (TWD)
- 歐元 (EUR)
- 英鎊 (GBP)

### 4. 日期格式 (Date Format)
- YYYY-MM-DD (ISO 標準) - 預設值
- DD/MM/YYYY (歐洲格式)
- MM/DD/YYYY (美國格式)

### 5. 通知設定 (Notifications)
- 啟用/停用通知
- 電子郵件通知設定
- 預設值：兩者都啟用

### 6. 時區設定 (Timezone)
- Asia/Tokyo (UTC+9) - 預設值
- Asia/Taipei (UTC+8)
- Asia/Shanghai (UTC+8)
- America/New_York (UTC-5)
- Europe/London (UTC+0)

## 技術架構

### 資料庫模型 (Prisma Schema)
```prisma
model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  language        String   @default("zh-TW")
  theme           String   @default("light")
  defaultCurrency String   @default("JPY")
  dateFormat      String   @default("YYYY-MM-DD")
  notificationsEnabled Boolean @default(true)
  emailNotifications Boolean @default(true)
  timezone        String?  @default("Asia/Tokyo")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}
```

### API 端點
- `GET /api/user-settings` - 取得使用者設定
- `PUT /api/user-settings` - 更新使用者設定

### React Hook
- `useUserSettings()` - 管理使用者設定狀態和操作

### 組件
- `UserSettings` - 主要的設定介面組件

## 使用方法

### 1. 在設定頁面中使用
```tsx
import UserSettings from '@/components/UserSettings';

export default function SettingsPage() {
  return (
    <div>
      <UserSettings />
      {/* 其他設定項目 */}
    </div>
  );
}
```

### 2. 在組件中使用 Hook
```tsx
import { useUserSettings } from '@/hooks/useUserSettings';

function MyComponent() {
  const { settings, updateSetting } = useUserSettings();
  
  const handleThemeChange = (theme: string) => {
    updateSetting('theme', theme);
  };
  
  return (
    <div>
      <p>Current theme: {settings.theme}</p>
      <button onClick={() => handleThemeChange('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

## 國際化支援

系統支援三種語言的完整翻譯：
- 繁體中文 (zh.json)
- 日文 (jp.json)
- 英文 (en.json)

所有設定項目都有對應的翻譯鍵值。

## 資料持久化

- 設定會自動儲存到資料庫
- 支援即時更新和同步
- 包含錯誤處理和載入狀態

## 未來擴展

可以考慮加入的額外設定：
- 字體大小設定
- 色彩主題自訂
- 鍵盤快捷鍵設定
- 隱私設定
- 資料匯出偏好

## 注意事項

1. 確保在使用前已經設定好 Prisma 資料庫
2. 需要執行 `prisma migrate` 來建立新的資料表
3. 設定變更會即時反映在 UI 上
4. 支援深色/淺色主題的自動切換
