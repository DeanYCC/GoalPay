#!/bin/bash

echo "🚀 啟動 GoalPay 應用程序..."

# 檢查是否安裝了必要的工具
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝，請先安裝 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安裝，請先安裝 npm"
    exit 1
fi

# 檢查 PostgreSQL 是否運行
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL 未運行，請確保 PostgreSQL 服務已啟動"
    echo "   在 macOS 上可以使用: brew services start postgresql"
    echo "   在 Ubuntu 上可以使用: sudo systemctl start postgresql"
fi

# 安裝後端依賴
echo "📦 安裝後端依賴..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# 安裝前端依賴
echo "📦 安裝前端依賴..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# 返回根目錄
cd ..

# 創建環境變量文件（如果不存在）
if [ ! -f "backend/.env" ]; then
    echo "📝 創建環境變量文件..."
    cp backend/env.example backend/.env
    echo "⚠️  請編輯 backend/.env 文件並設置您的配置"
fi

echo "✅ 依賴安裝完成！"
echo ""
echo "📋 下一步："
echo "1. 設置 PostgreSQL 數據庫"
echo "2. 編輯 backend/.env 文件"
echo "3. 運行數據庫遷移"
echo "4. 啟動應用程序"
echo ""
echo "🔧 設置數據庫："
echo "   psql -d postgres -c \"CREATE DATABASE goalpay;\""
echo "   psql -d goalpay -f db/schema.sql"
echo ""
echo "🚀 啟動應用程序："
echo "   # 終端 1: 啟動後端"
echo "   cd backend && npm run dev"
echo ""
echo "   # 終端 2: 啟動前端"
echo "   cd frontend && npm run dev"
echo ""
echo "🌐 訪問應用程序："
echo "   前端: http://localhost:3001"
echo "   後端 API: http://localhost:5001"
