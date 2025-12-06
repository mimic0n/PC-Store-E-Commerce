import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const ProductComparison = sequelize.define('ProductComparison', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    productIds: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'product_comparisons',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
        { fields: ['userId'] }
    ]
});

export default ProductComparison;