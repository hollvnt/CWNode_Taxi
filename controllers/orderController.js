const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const VerifyToken = require('../middleware/verifyToken');
const verifyToken = new VerifyToken(); 

module.exports = class OrderController {
  order = async (req, res) => {
    try {
      const { DriverID, AdressFrom, AdressTo, OrderTime, OrderDate, OrderComment } = req.body; 
      const OrderTariff = req.body.OrderTariff ? Number(req.body.OrderTariff) : null;
      const OrderCost  = req.body.OrderCost;
      console.log(`цена ${OrderCost}`); 
      const token = req.cookies.AuthToken;
      const decoded = jwt.verify(token, 'secretkey');
      const { id: UserID } = decoded; 
      console.log('decoded token:', decoded); 
      console.log('userID from decoded token:', UserID); 
      if (!AdressFrom || !AdressTo || !OrderTime || !OrderDate || !OrderTariff) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const orderTimeParts = OrderTime.split(':');
      const orderDateTime = new Date();
      orderDateTime.setHours(orderTimeParts[0]);
      orderDateTime.setMinutes(orderTimeParts[1]);

      const currentDateTime = new Date(); 

      if (orderDateTime <= currentDateTime) {
        return res.status(400).json({ error: 'Выберите время, которое идет после текущего времени' });
      }
      const newOrder = await prisma.orders.create({
        data: {
          UserID: Number(UserID),
          DriverID: 1,
          AdressFrom: AdressFrom,
          AdressTo: AdressTo,
          OrderTime: orderDateTime,
          OrderDate: new Date(OrderDate),
          OrderComment: OrderComment,
          OrderTariff: Number(OrderTariff),
          OrderCost: Number(OrderCost),
          OrderStatus: 'created',
        },
      }); 
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
  };
  authenticatedOrder = [verifyToken, this.order]; 
  logout = (req, res) => { 
    res.clearCookie('AuthToken'); 
    res.redirect('/');
  }; 
};
