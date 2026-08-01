import dotenv from 'dotenv';  
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import redis from 'redis';
import sequelize, { connectDB } from './config/connectDB.js'; 
import sendEmail from './config/emailService.js';
import orderRouter from './route/order.route.js';

import './models/index.js'; 

import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import wishlistRouter from './route/wishlist.route.js';
import ManageUserRouter from './route/ManageUser.route.js';


const app = express();
const PORT = process.env.PORT || 3001;
const redisClient = redis.createClient();

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await redisClient.get(key);
  
  if (cached) {
      return res.json(JSON.parse(cached));
  }
  
  res.originalJson = res.json;
  res.json = (data) => {
      redisClient.setex(key, duration, JSON.stringify(data));
      res.originalJson(data);
  };
  next();
};


// Sử dụng CORS để cho phép client gọi API từ một domain khác
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],  // URL của frontend
  credentials: true  // Cho phép gửi cookies
}));
// Middleware để parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.get('/', (request, response) => {
  response.json({
    message: 'Server is running on port: ' + PORT,
  });
});

app.get('/api/test', (request, response) => {
  response.json({
    success: true,
    message: 'API is working!',
    availableRoutes: [
      'GET  / - Test server',
      'GET  /api/test - Test API',
      'POST /api/users/register - Đăng ký tài khoản'
    ]
  });
});

app.get('/api/test-email', async (request, response) => {
  const result = await sendEmail({
      to: 'kimthonglord@gmail.com',
      subject: 'Test Email',
      title: 'Test',
      html: '<h1>Hello!</h1><p>Email is working!</p>'
  });
  
  response.json(result);
});

app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter); 
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter); 
app.use('/api/orders', orderRouter);
app.use('/api/admin/users', ManageUserRouter);
app.use('/api/products/getAllProducts', cacheMiddleware(300));

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: `Route ${request.method} ${request.url} không tồn tại`,
    hint: 'Kiểm tra lại URL và method'
  });
});

connectDB().then(async () => {
  await sequelize.sync({ alter: false });
  console.log('✅ Database synced!');
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error);
});