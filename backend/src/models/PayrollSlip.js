import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PayrollSlip = sequelize.define('PayrollSlip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.UUID,
    field: 'company_id',
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  slipDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'slip_date'
  },
  paymentPeriodStart: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'payment_period_start'
  },
  paymentPeriodEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'payment_period_end'
  },
  totalGross: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'total_gross'
  },
  totalNet: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'total_net'
  },
  totalDeductions: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'total_deductions'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'JPY'
  },
  fileUrl: {
    type: DataTypes.TEXT,
    field: 'file_url'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'payroll_slips',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default PayrollSlip;
