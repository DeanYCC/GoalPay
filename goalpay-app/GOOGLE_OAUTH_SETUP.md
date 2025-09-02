# Google OAuth 設置指南

## 🔐 Google OAuth 配置步驟

### 1. 創建 Google Cloud 項目

1. **前往 Google Cloud Console**：
   - 訪問 [Google Cloud Console](https://console.cloud.google.com/)
   - 使用您的Google帳戶登入

2. **創建新項目**：
   - 點擊頂部的項目選擇器
   - 點擊 "新建項目"
   - 輸入項目名稱：`GoalPay`
   - 點擊 "創建"

### 2. 啟用 Google+ API

1. **在左側菜單中選擇 "API 和服務" > "庫"**
2. **搜索 "Google+ API"**
3. **點擊 "Google+ API"**
4. **點擊 "啟用"**

### 3. 創建 OAuth 2.0 憑證

1. **前往 "API 和服務" > "憑證"**
2. **點擊 "創建憑證" > "OAuth 客戶端 ID"**
3. **選擇應用程序類型**：
   - 如果是Web應用：選擇 "Web 應用程序"
   - 如果是桌面應用：選擇 "桌面應用程序"

4. **配置 OAuth 同意畫面**：
   - 應用程序名稱：`GoalPay`
   - 用戶支持電子郵件：您的電子郵件
   - 開發者聯繫信息：您的電子郵件

5. **配置授權的重定向 URI**：
   - 開發環境：`http://localhost:5001/api/auth/google/callback`
   - 生產環境：`https://your-domain.vercel.app/api/auth/google/callback`

### 4. 獲取憑證信息

創建完成後，您將獲得：
- **客戶端 ID**：`your-client-id.apps.googleusercontent.com`
- **客戶端密鑰**：`your-client-secret`

## 🔧 後端配置

### 1. 安裝依賴

```bash
cd goalpay-app/backend
npm install passport passport-google-oauth20
```

### 2. 配置環境變量

創建 `.env` 文件：

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Session
SESSION_SECRET=your-session-secret
```

### 3. 更新 Passport 配置

在 `backend/config/passport.js` 中：

```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    // 處理用戶資料
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0].value
    };
    
    // 保存到數據庫或返回用戶資料
    return cb(null, user);
  }
));
```

### 4. 更新認證路由

在 `backend/routes/auth.js` 中：

```javascript
// Google OAuth 路由
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // 成功登入後重定向
    res.redirect('/dashboard');
  }
);
```

## 🌐 前端配置

### 1. 更新登入按鈕

在 `frontend/src/pages/Login.tsx` 中：

```javascript
const handleGoogleLogin = () => {
  // 重定向到後端 Google OAuth 端點
  window.location.href = '/api/auth/google';
};
```

### 2. 處理回調

在 `frontend/src/App.tsx` 中處理認證回調：

```javascript
useEffect(() => {
  // 檢查URL參數中是否有認證信息
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // 處理認證成功
    login(user, token);
    navigate('/dashboard');
  }
}, []);
```

## 🚀 生產環境部署

### 1. Vercel 環境變量

在 Vercel Dashboard 中設置環境變量：

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.vercel.app/api/auth/google/callback
SESSION_SECRET=your-session-secret
```

### 2. 更新重定向 URI

在 Google Cloud Console 中添加生產環境的重定向 URI：
- `https://your-domain.vercel.app/api/auth/google/callback`

### 3. 更新 API 路由

創建 `goalpay-app/api/auth/google.js`：

```javascript
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // 重定向到 Google OAuth
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## 🔒 安全注意事項

### 1. 保護敏感信息
- 永遠不要在客戶端代碼中暴露客戶端密鑰
- 使用環境變量存儲敏感信息
- 定期輪換客戶端密鑰

### 2. 驗證用戶資料
- 驗證從Google返回的用戶資料
- 檢查電子郵件域名（如果需要）
- 實施適當的錯誤處理

### 3. 會話管理
- 使用安全的會話配置
- 實施適當的會話超時
- 使用HTTPS（生產環境）

## 🧪 測試

### 1. 本地測試
```bash
# 啟動後端服務器
cd goalpay-app/backend
npm start

# 啟動前端服務器
cd goalpay-app/frontend
npm run dev
```

### 2. 測試流程
1. 訪問登入頁面
2. 點擊 "Google 登入"
3. 完成Google OAuth流程
4. 檢查是否成功重定向到儀表板

### 3. 測試登入按鈕
- 在Google OAuth配置完成前，可以使用 "🧪 測試登入" 按鈕
- 這個按鈕會創建一個測試用戶並直接進入儀表板

## 🐛 故障排除

### 常見問題

1. **"redirect_uri_mismatch" 錯誤**：
   - 檢查重定向URI是否正確配置
   - 確保開發和生產環境的URI都已添加

2. **"invalid_client" 錯誤**：
   - 檢查客戶端ID和密鑰是否正確
   - 確保API已啟用

3. **會話問題**：
   - 檢查SESSION_SECRET是否設置
   - 確保會話中間件正確配置

### 調試技巧

1. **檢查網絡請求**：
   - 使用瀏覽器開發者工具
   - 查看Network標籤中的請求

2. **檢查服務器日誌**：
   - 查看後端服務器控制台輸出
   - 檢查錯誤信息

3. **驗證配置**：
   - 確認所有環境變量都已設置
   - 檢查Passport配置是否正確

## 📞 獲取幫助

如果遇到問題：
1. 查看 [Google OAuth 文檔](https://developers.google.com/identity/protocols/oauth2)
2. 檢查 [Passport.js 文檔](http://www.passportjs.org/docs/google/)
3. 查看錯誤日誌和網絡請求

---

完成這些步驟後，您的GoalPay應用將支持完整的Google OAuth登入功能！
