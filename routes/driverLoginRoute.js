const express = require('express');
const DriverLoginController = require('../controllers/driverLoginController');

module.exports = () => {
    const router = express.Router();
    const controller = new DriverLoginController();

    router.post('/driverLogin', (req, res)=> {controller.driverLogin(req, res)});

    return router;
}