-- GoalPay 數據庫結構

-- 創建數據庫
CREATE DATABASE goalpay;

-- 使用數據庫
\c goalpay;

-- 用戶表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(500),
    company_name VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'JPY',
    theme VARCHAR(10) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'zh',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 薪資單表
CREATE TABLE payroll_slips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    employee_id VARCHAR(100),
    slip_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 薪資項目表
CREATE TABLE payroll_items (
    id SERIAL PRIMARY KEY,
    payroll_slip_id INTEGER REFERENCES payroll_slips(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'income' or 'deduction'
    item_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 創建索引
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_payroll_slips_user_id ON payroll_slips(user_id);
CREATE INDEX idx_payroll_slips_date ON payroll_slips(slip_date);
CREATE INDEX idx_payroll_items_slip_id ON payroll_items(payroll_slip_id);
CREATE INDEX idx_payroll_items_type ON payroll_items(item_type);

-- 更新時間戳觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 創建觸發器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_slips_updated_at BEFORE UPDATE ON payroll_slips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例數據
INSERT INTO users (google_id, email, name, company_name, currency, theme, language) VALUES
('google_123456789', 'user@example.com', '測試用戶', '測試公司', 'JPY', 'light', 'zh');

INSERT INTO payroll_slips (user_id, company, employee_id, slip_date) VALUES
(1, '測試公司', 'EMP001', '2024-01-31'),
(1, '測試公司', 'EMP001', '2024-02-29'),
(1, '測試公司', 'EMP001', '2024-03-31');

INSERT INTO payroll_items (payroll_slip_id, item_type, item_name, amount) VALUES
-- 2024年1月
(1, 'income', '基本工資', 300000),
(1, 'income', '加班費', 50000),
(1, 'income', '津貼', 20000),
(1, 'deduction', '所得稅', 25000),
(1, 'deduction', '健康保險', 15000),
(1, 'deduction', '養老金', 10000),
(1, 'deduction', '其他扣除', 5000),

-- 2024年2月
(2, 'income', '基本工資', 300000),
(2, 'income', '加班費', 45000),
(2, 'income', '津貼', 20000),
(2, 'deduction', '所得稅', 24000),
(2, 'deduction', '健康保險', 15000),
(2, 'deduction', '養老金', 10000),
(2, 'deduction', '其他扣除', 5000),

-- 2024年3月
(3, 'income', '基本工資', 300000),
(3, 'income', '加班費', 60000),
(3, 'income', '津貼', 20000),
(3, 'deduction', '所得稅', 26000),
(3, 'deduction', '健康保險', 15000),
(3, 'deduction', '養老金', 10000),
(3, 'deduction', '其他扣除', 5000);
