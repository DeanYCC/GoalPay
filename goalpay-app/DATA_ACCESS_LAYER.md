# 數據訪問層（DAL）設計文檔

## 🏗️ 架構概述

### 當前狀態
- ✅ 數據庫設計完整
- ✅ 表結構規範
- ❌ 缺少數據訪問層
- ❌ 業務邏輯與數據訪問混合

### 建議架構
```
backend/
├── config/
│   └── database.js          # 數據庫連接配置
├── models/                  # 數據模型層
│   ├── User.js
│   ├── PayrollSlip.js
│   ├── PayrollItem.js
│   └── index.js
├── repositories/            # 數據訪問層
│   ├── UserRepository.js
│   ├── PayrollRepository.js
│   └── index.js
├── services/                # 業務邏輯層
│   ├── UserService.js
│   ├── PayrollService.js
│   └── index.js
└── routes/                  # 路由層
    ├── users.js
    ├── payroll.js
    └── ...
```

## 📋 數據訪問層實現

### 1. 基礎Repository類

```javascript
// repositories/BaseRepository.js
class BaseRepository {
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db;
  }

  async findById(id) {
    const result = await this.db.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async findAll(conditions = {}) {
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];
    let paramCount = 1;

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = $${paramCount++}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`);

    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.db.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}
```

### 2. 用戶Repository

```javascript
// repositories/UserRepository.js
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor(db) {
    super('users', db);
    this.db = db;
  }

  async findByGoogleId(googleId) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE google_id = $1',
      [googleId]
    );
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async createOrUpdateGoogleUser(googleProfile) {
    const { id, emails, displayName, photos } = googleProfile;
    
    // 檢查是否已存在
    let user = await this.findByGoogleId(id);
    
    if (user) {
      // 更新現有用戶
      return await this.update(user.id, {
        name: displayName,
        picture: photos[0]?.value,
        updated_at: new Date()
      });
    } else {
      // 創建新用戶
      return await this.create({
        google_id: id,
        email: emails[0].value,
        name: displayName,
        picture: photos[0]?.value,
        company_name: '未設置',
        currency: 'JPY',
        theme: 'light',
        language: 'zh'
      });
    }
  }
}
```

### 3. 薪資Repository

```javascript
// repositories/PayrollRepository.js
const BaseRepository = require('./BaseRepository');

class PayrollRepository extends BaseRepository {
  constructor(db) {
    super('payroll_slips', db);
    this.db = db;
  }

  async findByUserId(userId) {
    const result = await this.db.query(
      `SELECT ps.*, 
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'item_type', pi.item_type,
                   'item_name', pi.item_name,
                   'amount', pi.amount
                 )
               ) as items
        FROM payroll_slips ps
        LEFT JOIN payroll_items pi ON ps.id = pi.payroll_slip_id
        WHERE ps.user_id = $1
        GROUP BY ps.id
        ORDER BY ps.slip_date DESC`,
      [userId]
    );
    return result.rows;
  }

  async findByIdWithItems(id) {
    const result = await this.db.query(
      `SELECT ps.*, 
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'item_type', pi.item_type,
                   'item_name', pi.item_name,
                   'amount', pi.amount
                 )
               ) as items
        FROM payroll_slips ps
        LEFT JOIN payroll_items pi ON ps.id = pi.payroll_slip_id
        WHERE ps.id = $1
        GROUP BY ps.id`,
      [id]
    );
    return result.rows[0];
  }

  async createWithItems(payrollData, items) {
    // 開始事務
    const client = await this.db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 創建薪資單
      const payrollResult = await client.query(
        `INSERT INTO payroll_slips (user_id, company, employee_id, slip_date, payment_method)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [payrollData.user_id, payrollData.company, payrollData.employee_id, 
         payrollData.slip_date, payrollData.payment_method]
      );
      
      const payrollSlip = payrollResult.rows[0];
      
      // 創建薪資項目
      for (const item of items) {
        await client.query(
          `INSERT INTO payroll_items (payroll_slip_id, item_type, item_name, amount)
           VALUES ($1, $2, $3, $4)`,
          [payrollSlip.id, item.item_type, item.item_name, item.amount]
        );
      }
      
      await client.query('COMMIT');
      return await this.findByIdWithItems(payrollSlip.id);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

### 4. 服務層

```javascript
// services/UserService.js
const UserRepository = require('../repositories/UserRepository');

class UserService {
  constructor(db) {
    this.userRepository = new UserRepository(db);
  }

  async getUserProfile(userId) {
    return await this.userRepository.findById(userId);
  }

  async updateUserProfile(userId, profileData) {
    return await this.userRepository.update(userId, profileData);
  }

  async handleGoogleLogin(googleProfile) {
    return await this.userRepository.createOrUpdateGoogleUser(googleProfile);
  }
}
```

```javascript
// services/PayrollService.js
const PayrollRepository = require('../repositories/PayrollRepository');

class PayrollService {
  constructor(db) {
    this.payrollRepository = new PayrollRepository(db);
  }

  async getUserPayrolls(userId) {
    return await this.payrollRepository.findByUserId(userId);
  }

  async getPayrollDetail(payrollId) {
    return await this.payrollRepository.findByIdWithItems(payrollId);
  }

  async createPayroll(payrollData, items) {
    return await this.payrollRepository.createWithItems(payrollData, items);
  }

  async processCSVUpload(userId, csvData) {
    // CSV處理邏輯
    const payrolls = [];
    
    for (const row of csvData) {
      const payrollData = {
        user_id: userId,
        company: row.company,
        employee_id: row.employee_id,
        slip_date: row.slip_date,
        payment_method: 'bank_transfer'
      };
      
      const items = [
        { item_type: 'income', item_name: '基本薪資', amount: row.base_salary },
        { item_type: 'income', item_name: '加班費', amount: row.overtime },
        { item_type: 'deduction', item_name: '所得稅', amount: row.income_tax },
        // ... 其他項目
      ];
      
      const payroll = await this.createPayroll(payrollData, items);
      payrolls.push(payroll);
    }
    
    return payrolls;
  }
}
```

## 🔄 路由層更新

### 更新後的路由示例

```javascript
// routes/users.js
const UserService = require('../services/UserService');
const db = require('../config/database');

const userService = new UserService(db);

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: '獲取用戶信息失敗' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updatedProfile = await userService.updateUserProfile(req.userId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: '更新用戶信息失敗' });
  }
});
```

## 🎯 實施計劃

### 階段1: 基礎架構
- [ ] 創建BaseRepository類
- [ ] 實現UserRepository
- [ ] 實現PayrollRepository

### 階段2: 服務層
- [ ] 實現UserService
- [ ] 實現PayrollService
- [ ] 添加業務邏輯

### 階段3: 路由重構
- [ ] 更新用戶路由
- [ ] 更新薪資路由
- [ ] 更新其他路由

### 階段4: 測試和優化
- [ ] 單元測試
- [ ] 集成測試
- [ ] 性能優化

## 📊 優勢

### 1. 關注點分離
- **Repository**: 數據訪問邏輯
- **Service**: 業務邏輯
- **Route**: 請求處理

### 2. 可維護性
- 代碼結構清晰
- 易於測試
- 易於擴展

### 3. 可重用性
- Repository可在多個Service中使用
- 業務邏輯可重用

### 4. 數據一致性
- 事務管理
- 數據驗證
- 錯誤處理

---

這個架構將大大提升您的應用的可維護性和擴展性！
