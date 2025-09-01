import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'google_id'
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'display_name'
  },
  avatarUrl: {
    type: DataTypes.TEXT,
    field: 'avatar_url'
  },
  preferredLanguage: {
    type: DataTypes.ENUM('en', 'jp', 'zh'),
    defaultValue: 'zh',
    field: 'preferred_language'
  },
  preferredCurrency: {
    type: DataTypes.ENUM('JPY', 'USD', 'TWD'),
    defaultValue: 'JPY',
    field: 'preferred_currency'
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'auto'),
    defaultValue: 'light'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User;
