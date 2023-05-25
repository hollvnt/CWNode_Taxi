const express = require('express'); 
const DriverPageController = require('../controllers/driverPageController'); 
const controller = new DriverPageController();

module.exports = () =>{
    const router = express.Router();

    router.get('/driverPage', (req, res) => {controller.getOrderList(req, res)});
    router.post('/acceptOrder', (req, res) => {controller.acceptOrder(req, res)});
    router.post('/confirmOrder', (req, res) => {controller.confirmOrderCompletion(req, res)});
    router.post('/cancelOrder', (req, res) => {controller.cancelOrder(req, res)});
    router.get('/orderDetails', (req, res) => {controller.getOrderDetails(req, res)}); 

    return router;
};