import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const Voucher = sequelize.define('Voucher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false
    },
    discountValue: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    minOrderAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    maxDiscountAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'vouchers',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['code'] },
        { fields: ['categoryId'] },
        { fields: ['isActive'] },
        { fields: ['startDate', 'endDate'] }
    ]
});

export default Voucher;