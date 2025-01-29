const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFilePath = path.join(__dirname, '../../users.json');

// Получение списка пользователей
router.get('/', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        const users = JSON.parse(data);
        res.json(users);
    });
});

// Добавление нового пользователя
router.post('/', (req, res) => {
    const newUser = req.body;

    if (!newUser.name || !newUser.email || !newUser.role) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        const users = JSON.parse(data);

        // Проверка на существующий email
        const existingUser = users.find(user => user.email === newUser.email);
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }

            res.status(201).json({ message: 'Пользователь добавлен', user: newUser });
        });
    });
});

// Удаление пользователя по email
router.delete('/:email', (req, res) => {
    const userEmail = req.params.email;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        let users = JSON.parse(data);
        const initialLength = users.length;

        // Фильтруем массив, исключая пользователя с указанным email
        users = users.filter(user => user.email !== userEmail);

        // Проверяем, был ли удален пользователь
        if (users.length === initialLength) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }

            res.json({ message: 'Пользователь успешно удален' });
        });
    });
});

module.exports = router;