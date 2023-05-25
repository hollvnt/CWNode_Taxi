const express = require('express'); 
const DriverRegisterController = require('../controllers/driverRegisterController'); 
const controller = new DriverRegisterController();

module.exports = () =>{
    const router = express.Router();

    router.post('/becomeDriver', (req, res) => {controller.becomeDriver(req, res)});

    return router;
};