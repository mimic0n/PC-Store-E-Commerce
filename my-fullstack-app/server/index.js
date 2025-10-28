// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Sử dụng CORS để cho phép client gọi API từ một domain khác
app.use(cors());

// Middleware để parse JSON
app.use(express.json());

// Tạo một route API đơn giản
app.get('/api/message', (req, res) => {
  res.json({ message: 'Xin chào từ Backend! 👋' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});