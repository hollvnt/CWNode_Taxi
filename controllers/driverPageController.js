const express = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken'); 

const app = express();
app.use(cookieParser()); 

module.exports = class DriverPageContoller{

    getOrderList = async (req, res) => {
        try { 
            const orders = await prisma.orders.findMany({
            where: { OrderStatus: 'created' },
            orderBy: [{ OrderDate: 'asc' }, { OrderTime: 'asc' }], 
        }); 
        res.render('driverPage', { orders });
        } catch (error) { 
            console.error(error); 
            res.status(500).json({ message: 'Ошибка сервера' });
        } 
    }; 

    acceptOrder = async (req, res) => {
        const token = req.cookies.AuthToken;
        const decoded = jwt.verify(token, 'secretkey');
        const { id: DriverID } = decoded; 
    
        const orderID = req.body.OrderID;
        try { 
            const order = await prisma.orders.findUnique({
            where: { OrderID: Number(orderID) }, 
        }); 
        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' }); 
        } 
        if (order.OrderStatus !== 'created') {
            return res.status(400).json({ message: 'Невозможно принять данный заказ' }); 
        } 
        const updatedOrder = await prisma.orders.update({
            where: { OrderID: Number(orderID) },
            data: { 
                OrderStatus: 'Выполняется', 
                DriverID: Number(DriverID),
            }, 
        }); 
        const io = req.io; 
        io.emit('orderAccepted', { orderID: updatedOrder.OrderID }); 
        console.log(updatedOrder) 
        res.cookie('OrderID', orderID); 
        res.redirect(`/api/orderDetails`);
        } catch (error) { 
            console.error(error); 
            res.status(500).json({ message: 'Ошибка сервера' });
        } 
    }; 

    
    getOrderDetails = async (req, res) => {
        const token = req.cookies.AuthToken;
        const decoded = jwt.verify(token, 'secretkey');
        const { id: DriverID } = decoded; 
        const orderID = Number(req.cookies.OrderID);
    
        try {
            const order = await prisma.orders.findFirst({ 
                where: {
                OrderID: orderID,
                DriverID: DriverID, 
            }, 
            include: { 
                Tariffs: true, 
            },
            });
    
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }
    
            const { OrderID, AdressFrom, AdressTo, OrderTime, OrderDate, OrderComment, OrderCost, OrderStatus, Tariffs } = order;
            const { TariffName, TariffDescription } = Tariffs;
    
            res.render('orderDetails', {
                order: {
                    OrderID,
                    AdressFrom,
                    AdressTo,
                    OrderTime: OrderTime.toLocaleTimeString(),
                    OrderDate: OrderDate.toLocaleDateString(),
                    OrderComment,
                    OrderCost,
                    OrderStatus,
                    TariffName,
                    TariffDescription,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    };
    

    confirmOrderCompletion = async (req, res) => {
        const token = req.cookies.AuthToken;
        const decoded = jwt.verify(token, 'secretkey');
        const { id: DriverID } = decoded; 
        const orderID = req.body.OrderID;
        try {
            const order = await prisma.orders.findUnique({
                where: { OrderID: Number(orderID) },
            });
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            } 
            if (order.DriverID !== Number(DriverID)) {
                return res.status(403).json({ message: 'Вы не являетесь водителем данного заказа' });
            }
            const updatedOrder = await prisma.orders.update({
                where: { OrderID: Number(orderID) },
                data: {
                    OrderStatus: 'Выполнен',
                },
            }); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    };

    cancelOrder = async (req, res) => {
        const token = req.cookies.AuthToken;
        const decoded = jwt.verify(token, 'secretkey');
        const { id: DriverID } = decoded; 
        const orderID = req.body.OrderID;
        try {
            const order = await prisma.orders.findUnique({
                where: { OrderID: Number(orderID) },
            });
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            } 
            if (order.DriverID !== Number(DriverID)) {
                return res.status(403).json({ message: 'Вы не являетесь водителем данного заказа' });
            }
            const updatedOrder = await prisma.orders.update({
                where: { OrderID: Number(orderID) },
                data: {
                    OrderStatus: 'Отменен', 
                },
            }); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    };
}