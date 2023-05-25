const express = require('express');
const profileUsersController = require('../controllers/profileUsersController');
const multer = require('multer'); 
const storage = multer.diskStorage({
destination: './static/',
filename: function(req, file, cb) {
cb(null, Date.now() + '-' + file.originalname);
}
});
const upload = multer({ storage });

module.exports = () =>{
  const constroller = new profileUsersController();
  const router = express.Router();

  router.get('/profile',  (req, res) => {constroller.userProfile(req, res)});
  // router.post('/updateAvatar',  (req, res) => {constroller.u(req, res)});
  router.get('/statistics', (req, res) => {constroller.tripStatistics(req, res)}); 
  router.put('/userProfile', (req, res) => {constroller.updateUserProfile(req, res)});
  return router;
}