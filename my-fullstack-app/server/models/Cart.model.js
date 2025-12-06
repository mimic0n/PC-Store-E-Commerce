import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    }
}, {
    tableName: 'carts',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['userId'] }
    ]
});

export default Cart;