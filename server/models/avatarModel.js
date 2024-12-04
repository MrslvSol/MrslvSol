// server/models/avatarModel.js
const path = require('path');

// Модель для аватара (например, сохраняем в базу данных или храним путь)
class AvatarModel {
    static saveAvatar(userId, avatarPath) {
        // Пример сохранения пути аватара в базе данных (псевдокод)
        // Для настоящей базы данных, например, MongoDB или PostgreSQL, нужно будет использовать ORM или драйвер

        // Возвращаем объект с данными аватара
        return {
            userId: userId,
            avatarPath: avatarPath,
        };
    }
}

module.exports = AvatarModel;
