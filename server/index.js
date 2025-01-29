const express = require('express');
const path = require('path');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Роуты
app.use('/api/users', usersRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});