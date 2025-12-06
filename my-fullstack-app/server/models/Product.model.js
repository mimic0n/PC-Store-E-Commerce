import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    salePrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    saleCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: null
    },
    thumbnail: {
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
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    categoryLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Cấp danh mục của sản phẩm: 1 = Root, 2 = Sub, 3 = Third level'
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['slug'] },
        { fields: ['categoryId'] },
        { fields: ['categoryLevel'] },
        { fields: ['price'] },
        { fields: ['rating'] },
        { fields: ['isFeatured'] },
        { fields: ['isActive'] },
        { fields: ['brand'] },
        { fields: ['saleCount'] }
    ]
});

export default Product;