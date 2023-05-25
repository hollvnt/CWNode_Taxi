const express = require('express');
const OrderController = require('../controllers/orderController');

module.exports = () =>{
  const constroller = new OrderController();
  const router = express.Router();

  router.post('/order', (req, res) => {constroller.order(req, res)});
  router.get('/logout', (req, res) => {constroller.logout(req, res)});

  return router;
}