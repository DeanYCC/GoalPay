import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PayrollItem = sequelize.define('PayrollItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  slipId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'slip_id',
    references: {
      model: 'payroll_slips',
      key: 'id'
    }
  },
  termId: {
    type: DataTypes.UUID,
    field: 'term_id',
    references: {
      model: 'payroll_terms',
      key: 'id'
    }
  },
  originalLabel: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'original_label'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  itemType: {
    type: DataTypes.ENUM('income', 'deduction'),
    allowNull: false,
    field: 'item_type'
  },
  category: {
    type: DataTypes.STRING(50)
  },
  customDescription: {
    type: DataTypes.TEXT,
    field: 'custom_description'
  }
}, {
  tableName: 'payroll_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default PayrollItem;
