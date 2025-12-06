import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'carts',
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'cart_items',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['cartId'] },
        { fields: ['productId'] },
        { unique: true, fields: ['cartId', 'productId'] }
    ]
});

export default CartItem;