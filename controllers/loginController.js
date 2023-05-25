// const express = require('express');
// const cookieParser = require('cookie-parser');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const jwt = require('jsonwebtoken');


// module.exports = class LoginController {
//   login = async (req, res) => {
//     try {
//       const { UserEmail, UserPassword } = req.body;
//       if (!UserEmail || !UserPassword) {
//         return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
//       }
//       const login = await prisma.users.findFirst({
//         where: {
//           UserEmail: UserEmail,
//           UserPassword: UserPassword,
//         },
//       });
//       if (!login) {
//         return res.status(401).json({ message: 'Неправильный email или пароль' });
//       } else { 
//         const token = jwt.sign({ id: login.UserID }, 'secretkey');
        
//         const decoded = jwt.verify(token, 'secretkey'); 
//         console.log(decoded.id); 
//         console.log(decoded.email); 
//         console.log(decoded.phone); 
//         res.cookie('AuthToken', token, { maxAge: 900000, httpOnly: true });
//         console.log(token);
//         res.redirect('./order');
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   };
// };

const express = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = class LoginController {
  login = async (req, res) => {
    try {
      const { UserEmail, UserPassword } = req.body;
      if (!UserEmail || !UserPassword) {
        return res.redirect('/?error=' + encodeURIComponent('Неправильный email или пароль'));
      }
      
      const user = await prisma.users.findFirst({ where: { UserEmail: UserEmail } });
      if (!user) {
        return res.redirect('/?error=' + encodeURIComponent('Неправильный email или пароль'));
      }

      const passwordMatch = await bcrypt.compare(UserPassword, user.UserPassword);
      if (!passwordMatch) {
        return res.redirect('/?error=' + encodeURIComponent('Неправильный email или пароль'));
      }

      const token = jwt.sign({ id: user.UserID }, 'secretkey');

      const decoded = jwt.verify(token, 'secretkey');
      console.log(decoded.id);
      console.log(decoded.email);
      console.log(decoded.phone);
      res.cookie('AuthToken', token, { maxAge: 900000, httpOnly: true });
      console.log(token);
      res.redirect('./order');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
