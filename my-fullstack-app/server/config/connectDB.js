import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

// Test connection
const connectDB = async () => {
    try {
        await sequelize.sync();
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL (XAMPP) thành công!');
    } catch (error) {
        console.error('❌ Không thể kết nối database:', error);
        process.exit(1);
    }
};

export { connectDB };
export default sequelize; 