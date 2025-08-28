-- GoalPay Database Schema
-- PostgreSQL database for salary analysis application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'zh' CHECK (preferred_language IN ('en', 'jp', 'zh')),
    preferred_currency VARCHAR(3) DEFAULT 'JPY' CHECK (preferred_currency IN ('JPY', 'USD', 'TWD')),
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    position VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll terms dictionary
CREATE TABLE payroll_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    standard_key VARCHAR(100) UNIQUE NOT NULL,
    original_label_en VARCHAR(255),
    original_label_jp VARCHAR(255),
    original_label_zh VARCHAR(255),
    description_en TEXT,
    description_jp TEXT,
    description_zh TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('income', 'deduction', 'tax', 'insurance', 'other')),
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll slips table
CREATE TABLE payroll_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    slip_date DATE NOT NULL,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    total_gross DECIMAL(15,2) NOT NULL,
    total_net DECIMAL(15,2) NOT NULL,
    total_deductions DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'JPY',
    file_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll items (individual line items)
CREATE TABLE payroll_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slip_id UUID NOT NULL REFERENCES payroll_slips(id) ON DELETE CASCADE,
    term_id UUID REFERENCES payroll_terms(id) ON DELETE SET NULL,
    original_label VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('income', 'deduction')),
    category VARCHAR(50),
    custom_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User custom payroll terms
CREATE TABLE user_custom_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_label VARCHAR(255) NOT NULL,
    standard_key VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, original_label)
);

-- Indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_payroll_slips_user_id ON payroll_slips(user_id);
CREATE INDEX idx_payroll_slips_date ON payroll_slips(slip_date);
CREATE INDEX idx_payroll_items_slip_id ON payroll_items(slip_id);
CREATE INDEX idx_payroll_terms_standard_key ON payroll_terms(standard_key);
CREATE INDEX idx_payroll_terms_category ON payroll_terms(category);

-- Insert default payroll terms
INSERT INTO payroll_terms (standard_key, original_label_en, original_label_jp, original_label_zh, description_en, description_jp, description_zh, category) VALUES
('BASIC_SALARY', 'Basic Salary', '基本給', '基本薪資', 'Base salary before deductions', '控除前の基本給', '扣除前的基本薪資', 'income'),
('OVERTIME_PAY', 'Overtime Pay', '残業手当', '加班費', 'Additional pay for overtime work', '残業に対する追加手当', '加班工作的額外薪資', 'income'),
('BONUS', 'Bonus', 'ボーナス', '獎金', 'Performance or seasonal bonus', '業績や季節のボーナス', '績效或季節性獎金', 'income'),
('ALLOWANCE', 'Allowance', '手当', '津貼', 'Various work-related allowances', '各種の手当', '各種工作相關津貼', 'income'),
('INCOME_TAX', 'Income Tax', '所得税', '所得稅', 'Government tax on income', '政府が課す税金', '政府徵收的稅金', 'tax'),
('RESIDENCE_TAX', 'Residence Tax', '住民稅', '住民稅', 'Local government residence tax', '地方自治体の住民稅', '地方政府徵收的住民稅', 'tax'),
('HEALTH_INSURANCE', 'Health Insurance', '健康保険', '健康保險', 'National health insurance deduction', '健康保険料の控除', '全民健保扣款', 'insurance'),
('CARE_INSURANCE', 'Care Insurance', '介護保険', '照護保險', 'Long-term care insurance', '介護保険料', '長期照護保険', 'insurance'),
('WELFARE_PENSION', 'Welfare Pension', '厚生年金', '厚生年金', 'Employee pension insurance', '厚生年金保険料', '員工年金保險', 'insurance'),
('EMPLOYMENT_INSURANCE', 'Employment Insurance', '雇用保険', '雇用保險', 'Unemployment insurance', '雇用保険料', '失業保險', 'insurance'),
('OTHER_DEDUCTIONS', 'Other Deductions', 'その他の控除', '其他扣除', 'Miscellaneous deductions', 'その他の控除項目', '其他扣除項目', 'deduction');

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_terms_updated_at BEFORE UPDATE ON payroll_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_slips_updated_at BEFORE UPDATE ON payroll_slips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_custom_terms_updated_at BEFORE UPDATE ON user_custom_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
