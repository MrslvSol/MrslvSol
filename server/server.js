const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('./models/userModel');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const fs = require('fs');
const searchRoutes = require('./routes/searchRoutes');
const photoRoute = require('./routes/photoRoute');
const { uploadPhoto } = require('./controllers/photoController'); // Импорт контроллера загрузки фото

// Настройки окружения
dotenv.config();
const app = express();

// Проверка и создание папки uploads, если она не существует
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors()); // Разрешаем запросы с фронтенда
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка для Multer (сохранение изображений)
const storage = multer.diskStorage({
    destination: uploadDir, // Папка для сохранения изображений
    filename: (req, file, cb) => {
        // Генерация уникального имени для каждого файла
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Ограничение на типы и размер файлов
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Неверный формат файла. Допустимы только изображения.'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // Ограничение на размер файла (5MB)
    }
});

app.post('/photos/upload', upload.single('image'), async (req, res) => {
    try {
        const { userId } = req.body; // Получаем userId
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'Файл не был загружен' });
        }

        // Путь к изображению после загрузки
        const imageUrl = `/uploads/${file.filename}`;
        
        // Сохраняем информацию о фото в базе данных через контроллер uploadPhoto
        const result = await uploadPhoto({
            userId,
            imageUrl,
        });

        // Получаем сохранённый объект фото из базы данных
        const savedImage = result; // Предполагается, что result содержит сохранённую запись

        // Возвращаем ссылку на изображение из базы данных
        res.status(201).json({
            success: true,
            imageUrl: savedImage.imageUrl, // Ссылка на изображение из базы данных
            photo: savedImage, // Возвращаем сохранённую запись фото
        });
    } catch (error) {
        console.error('Ошибка при загрузке фото:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Маршруты для других операций (поиск, пользователи и т.д.)
app.use('/api', searchRoutes);
app.use('/api/user', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', require('./routes/upload.route'));
app.use('/photos', photoRoute);


// Маршрут для авторизации пользователя (login)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Пользователь не найден' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Неверные данные для входа' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Маршрут для регистрации пользователя
app.post('/api/auth/register', async (req, res) => {
    const { first_name, last_name, address, birth_date, email, password } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(first_name, last_name, address, birth_date, email, hashedPassword);
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});




