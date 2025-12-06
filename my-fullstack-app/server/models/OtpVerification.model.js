import { DataTypes } from 'sequelize'; 
import sequelize from '../config/connectDB.js';  

const OtpVerification = sequelize.define('OtpVerification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('register', 'login', 'reset_password', 'change_email'),
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'otp_verifications',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
        { fields: ['email'] },
        { fields: ['otp'] },
        { fields: ['type'] },
        { fields: ['expiresAt'] }
    ]
});

export default OtpVerification;