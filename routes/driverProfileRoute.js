const express = require('express');
const profileDriverController = require('../controllers/driverProfileController');
const multer = require('multer'); 

module.exports = () =>{
  const constroller = new profileDriverController();
  const router = express.Router();

  router.get('/driverProfile',  (req, res) => {constroller.driverProfile(req, res)}); 
  router.post('/driverUpdateProfile', (req, res) => {constroller.driverProfileUpdate(req, res)});
  return router;
}