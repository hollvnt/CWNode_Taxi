const ejs = require('ejs');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken'); 
const bodyParser = require('body-parser'); 
const app = require('express')();
const path = require('path');
const Uuid = require('uuid');
const { config } = require('process');
const multer = require('multer'); 

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'static/')
//   },
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + '.png')
//   }
// }) 
// const maxFileSize = 50 * 1024 * 1024; // 50 MB

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: maxFileSize }
// }).single('image');

module.exports = class profileUsersController{
  userProfile = async (req, res) => {
    try {
      const token = req.cookies.AuthToken;
      const decoded = jwt.verify(token, 'secretkey');
      const { id: UserID } = decoded; 
  
      const user = await prisma.users.findUnique({
        where: {
          UserID: Number(UserID)
        }
      });
  
      const template = fs.readFileSync('./views/userProfile.ejs', 'utf-8');
      const html = ejs.render(template, { user });
      res.send(html);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } 
  
  updateUserProfile = async (req, res) => {
    try {
      const token = req.cookies.AuthToken;
      const decoded = jwt.verify(token, 'secretkey');
      const { id: UserID } = decoded; 
  
      const { UserName, UserEmail, UserLastName, UserPhone } = req.body; 

      const updatedUser = await prisma.users.update({
        where: { UserID: Number(UserID) },
        data: {
          UserName: UserName,
          UserLastName: UserLastName,
          UserEmail: UserEmail,
          UserPhone: UserPhone, 
        }
      });
  
      req.user = updatedUser;

      res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  tripStatistics = async (req, res) => {
    try {
      const token = req.cookies.AuthToken;
      const decoded = jwt.verify(token, 'secretkey');
      const { id: UserID } = decoded; 
      const user = await prisma.users.findUnique({
        where: { UserID: Number(UserID) },
        include: {
          Orders: {
            select: {
              AdressFrom: true,
              AdressTo: true,
              OrderDate: true,
              OrderStatus: true,
              OrderCost: true,
              OrderTime: true
            }
          }
        }
      });
      const orders = user.Orders.map((order) => {
        return {
          AdressFrom: order.AdressFrom,
          AdressTo: order.AdressTo,
          OrderDate: order.OrderDate.toDateString(),
          OrderStatus: order.OrderStatus,
          OrderCost: order.OrderCost,
          OrderTime: order.OrderTime.toLocaleTimeString('ru-RU', { hour: 'numeric', minute: 'numeric' }) 
        };
      }); 
      const filteredOrders = orders.filter((order) => {
        return order.OrderStatus === 'Выполнен' || order.OrderStatus === 'Отменен';
      }); 
      const currentDate = new Date(); 
      res.render('userStatistic', { data: filteredOrders, currentDate });
    } catch (error) {
      console.log(error);
    }
  };
  
}