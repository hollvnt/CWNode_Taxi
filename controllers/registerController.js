const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

module.exports = class RegisterController {
  register = async (req, res) => {
    try {
      let { UserName, UserLastName, UserEmail, UserPhone, UserPassword } = req.body; 
      UserName = UserName.trim();
      UserLastName = UserLastName.trim();
      UserEmail = UserEmail.trim();
      UserPhone = UserPhone.trim();
      UserPassword = UserPassword.trim();

    
      if (!UserName || !UserLastName || !UserEmail || !UserPhone || !UserPassword) {
        return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
      } 

      if (UserName.includes(' ') || UserLastName.includes(' ') || UserEmail.includes(' ') || UserPhone.includes(' ') || UserPassword.includes(' ')) {
        return res.status(400).json({ message: 'Поля не должны содержать пробелы' });
      }

      const existingUser = await prisma.users.findFirst({ where: { UserEmail: UserEmail } });
      if (existingUser) {
        return res.status(409).json({ message: 'Пользователь с такой почтой уже существует' });
      } 
      const hashedPassword = await bcrypt.hash(UserPassword, 10);

      const register = await prisma.users.create({
        data: {
          UserName: UserName,
          UserLastName: UserLastName,
          UserEmail: UserEmail,
          UserPhone: UserPhone,
          UserPassword: hashedPassword, 
        },
      });

      res.json({ message: 'Регистрация прошла успешно' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}
