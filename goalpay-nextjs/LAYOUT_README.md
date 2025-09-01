# GoalPay 新佈局功能說明

## 概述

我們已經成功將 GoalPay 應用程式從頂部導航佈局升級為現代化的側邊欄佈局，參考了 Base44 的設計風格。

## 新功能特點

### 1. 側邊欄導航
- **固定側邊欄**：寬度 256px，包含完整的導航選單
- **響應式設計**：在移動設備上自動隱藏，可通過漢堡選單展開
- **現代化設計**：使用 CSS 變數和 Tailwind CSS 實現一致的設計語言

### 2. 導航項目
- **儀表板** (`/dashboard`) - 薪資分析概覽
- **上傳薪資** (`/upload`) - 薪資單上傳功能
- **報告** (`/reports`) - 薪資報告生成
- **分析** (`/analytics`) - 薪資數據分析
- **設定** (`/settings`) - 用戶偏好設定

### 3. 用戶偏好設定
- **語言選擇**：支援繁體中文、日本語、English
- **主題切換**：淺色/深色主題，自動保存用戶偏好
- **即時預覽**：主題切換立即生效，無需重新載入

### 4. 用戶資訊顯示
- **用戶頭像**：顯示用戶姓名首字母
- **用戶角色**：薪資分析師
- **登出功能**：安全的登出按鈕

### 5. 移動端適配
- **漢堡選單**：在移動設備上顯示側邊欄觸發按鈕
- **覆蓋層**：側邊欄展開時顯示背景遮罩
- **觸控友好**：優化的觸控體驗

## 技術實現

### CSS 變數系統
```css
:root {
  --background: 248 250 252;
  --foreground: 15 23 42;
  --card: 255 255 255;
  --card-foreground: 15 23 42;
  --primary: 37 99 235;
  --muted: 241 245 249;
  --border: 226 232 240;
  /* ... 更多變數 */
}

.dark {
  --background: 2 6 23;
  --foreground: 226 232 240;
  /* ... 深色主題變數 */
}
```

### Tailwind CSS 配置
- 新增了 CSS 變數支援
- 自定義顏色系統
- 響應式設計工具

### 組件架構
- **Layout.tsx**：主要的佈局組件
- **LanguageSelector.tsx**：語言選擇器組件
- 各頁面組件使用 Layout 包裝

## 使用方法

### 1. 基本使用
```tsx
import Layout from '@/components/Layout';

export default function MyPage() {
  return (
    <Layout>
      <div>您的頁面內容</div>
    </Layout>
  );
}
```

### 2. 主題切換
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();
```

### 3. 語言切換
```tsx
import { useLanguage } from '@/contexts/LanguageContext';

const { language, setLanguage } = useLanguage();
```

## 頁面範例

### Dashboard 頁面
- 統計卡片網格佈局
- 最近活動列表
- 響應式設計

### Analytics 頁面
- 薪資趨勢圖表
- 扣除項目分析
- 數據匯出功能

### Settings 頁面
- 個人設定
- 偏好設定
- 通知設定
- 數據管理
- 安全性設定

## 自定義選項

### 1. 顏色主題
可以通過修改 CSS 變數來自定義顏色：
```css
:root {
  --primary: 37 99 235; /* 主色調 */
  --accent: 245 158 11; /* 強調色 */
}
```

### 2. 導航項目
在 `Layout.tsx` 中修改 `navigationItems` 陣列來添加或移除導航項目。

### 3. 側邊欄寬度
修改 CSS 類別中的 `w-64` 來調整側邊欄寬度。

## 瀏覽器支援

- **現代瀏覽器**：Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Grid**：支援 CSS Grid 佈局
- **CSS 變數**：支援 CSS 自定義屬性
- **Flexbox**：完整的 Flexbox 支援

## 性能優化

- **CSS 變數**：減少重複的 CSS 代碼
- **Tailwind JIT**：按需生成 CSS 類別
- **響應式圖片**：優化的圖片載入
- **懶載入**：組件按需載入

## 未來改進

1. **動畫效果**：添加更多微互動動畫
2. **鍵盤導航**：完整的鍵盤導航支援
3. **無障礙功能**：ARIA 標籤和螢幕閱讀器支援
4. **主題預設**：更多預設主題選項
5. **自定義佈局**：用戶可自定義側邊欄內容

## 故障排除

### 常見問題

1. **側邊欄不顯示**
   - 檢查 CSS 變數是否正確定義
   - 確認 Tailwind 配置是否正確

2. **主題切換不工作**
   - 檢查 ThemeContext 是否正確配置
   - 確認 localStorage 權限

3. **語言切換問題**
   - 檢查 LanguageContext 配置
   - 確認語言檔案是否存在

### 調試技巧

1. 使用瀏覽器開發者工具檢查 CSS 變數
2. 檢查 Console 中的錯誤訊息
3. 確認所有必要的依賴都已安裝

## 總結

新的側邊欄佈局為 GoalPay 提供了更現代、更專業的外觀，同時保持了良好的用戶體驗和響應式設計。這個佈局系統易於維護和擴展，為未來的功能開發奠定了堅實的基礎。
