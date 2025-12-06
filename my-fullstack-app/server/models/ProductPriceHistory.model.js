import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const ProductPriceHistory = sequelize.define('ProductPriceHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    oldPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    newPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    oldSalePrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    newSalePrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    changedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    reason: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'product_price_history',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
        { fields: ['productId'] },
        { fields: ['createdAt'] }
    ]
});

export default ProductPriceHistory;