import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PayrollTerm = sequelize.define('PayrollTerm', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  standardKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'standard_key'
  },
  originalLabelEn: {
    type: DataTypes.STRING,
    field: 'original_label_en'
  },
  originalLabelJp: {
    type: DataTypes.STRING,
    field: 'original_label_jp'
  },
  originalLabelZh: {
    type: DataTypes.STRING,
    field: 'original_label_zh'
  },
  descriptionEn: {
    type: DataTypes.TEXT,
    field: 'description_en'
  },
  descriptionJp: {
    type: DataTypes.TEXT,
    field: 'description_jp'
  },
  descriptionZh: {
    type: DataTypes.TEXT,
    field: 'description_zh'
  },
  category: {
    type: DataTypes.ENUM('income', 'deduction', 'tax', 'insurance', 'other'),
    allowNull: false
  },
  isCustom: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_custom'
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'payroll_terms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default PayrollTerm;
