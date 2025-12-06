import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const PasswordResetToken = sequelize.define('PasswordResetToken', {
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
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'password_reset_tokens',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
        { fields: ['token'] },
        { fields: ['userId'] },
        { fields: ['expiresAt'] }
    ]
});

export default PasswordResetToken;