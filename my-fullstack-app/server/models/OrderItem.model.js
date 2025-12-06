import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    productName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    productImage: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    specifications: {
        type: DataTypes.JSON,
        defaultValue: null
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    salePrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    totalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
}, {
    tableName: 'order_items',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['orderId'] },
        { fields: ['productId'] }
    ]
});

export default OrderItem;