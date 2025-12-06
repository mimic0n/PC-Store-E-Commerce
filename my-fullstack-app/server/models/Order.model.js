import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    province: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ward: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    shippingFee: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    shippingMethod: {
        type: DataTypes.ENUM('standard', 'express', 'same_day'),
        defaultValue: 'standard'
    },
    estimatedDelivery: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    discount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    voucherCode: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    paymentMethod: {
        type: DataTypes.ENUM('cod', 'banking', 'momo', 'vnpay'),
        defaultValue: 'cod'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    orderStatus: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    paidAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['orderCode'] },
        { fields: ['userId'] },
        { fields: ['orderStatus'] },
        { fields: ['paymentStatus'] },
        { fields: ['createdAt'] },
        { fields: ['voucherCode'] }
    ]
});

export default Order;