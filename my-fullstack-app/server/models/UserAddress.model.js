import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  
const UserAddress = sequelize.define('UserAddress', {
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
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    province: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ward: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    addressDetail: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    addressType: {
        type: DataTypes.ENUM('home', 'office', 'other'),
        defaultValue: 'home'
    }
}, {
    tableName: 'user_addresses',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        { fields: ['userId'] },
        { fields: ['isDefault'] }
    ]
});

export default UserAddress;