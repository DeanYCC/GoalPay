import User from './User.js';
import Company from './Company.js';
import PayrollTerm from './PayrollTerm.js';
import PayrollSlip from './PayrollSlip.js';
import PayrollItem from './PayrollItem.js';

// User associations
User.hasMany(Company, { foreignKey: 'userId', as: 'companies' });
User.hasMany(PayrollSlip, { foreignKey: 'userId', as: 'payrollSlips' });
User.hasMany(PayrollTerm, { foreignKey: 'createdBy', as: 'customTerms' });

// Company associations
Company.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Company.hasMany(PayrollSlip, { foreignKey: 'companyId', as: 'payrollSlips' });

// PayrollTerm associations
PayrollTerm.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
PayrollTerm.hasMany(PayrollItem, { foreignKey: 'termId', as: 'payrollItems' });

// PayrollSlip associations
PayrollSlip.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PayrollSlip.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
PayrollSlip.hasMany(PayrollItem, { foreignKey: 'slipId', as: 'payrollItems' });

// PayrollItem associations
PayrollItem.belongsTo(PayrollSlip, { foreignKey: 'slipId', as: 'payrollSlip' });
PayrollItem.belongsTo(PayrollTerm, { foreignKey: 'termId', as: 'payrollTerm' });

export {
  User,
  Company,
  PayrollTerm,
  PayrollSlip,
  PayrollItem
};
