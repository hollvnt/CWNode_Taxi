const express = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cookieParser());

module.exports = class LoginController { 
  driverLogin = async (req, res) => {
    try {
      const { UserEmail, UserPassword } = req.body;
      if (!UserEmail || !UserPassword) {
        return res.redirect('/?error=' + encodeURIComponent('Не все обязательные поля заполнены'));
      }
      
      const user = await prisma.users.findFirst({
        where: { UserEmail: UserEmail },
      });
      
      if (!user) {
        return res.redirect('/?error=' + encodeURIComponent('пользователь с такой почтой не найден'));
      }
      
      const isPasswordValid = await bcrypt.compare(UserPassword, user.UserPassword);
      if (!isPasswordValid) {
        return res.redirect('/?error=' + encodeURIComponent('Неправильный email или пароль'));
      }
      
      const driver = await prisma.drivers.findFirst({
        where: { UserID: user.UserID },
        include: { Users: true }
      });
      
      if (!driver) {
        return res.status(401).json({ message: 'Водитель не найден' });
      }
      
      const token = jwt.sign({ id: driver.DriverID }, 'secretkey');
      res.cookie('AuthToken', token, { maxAge: 900000, httpOnly: true });
      const decoded = jwt.verify(token, 'secretkey'); 
      return res.redirect('./driverPage');
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  };
};
